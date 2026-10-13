import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:5173';
const SCREENSHOT_DIR = path.resolve('docs/responsive-audit/screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const VIEWPORTS = [
  // Mobile
  { category: 'Mobile', name: 'iPhone SE (1st gen)', width: 320, height: 568 },
  { category: 'Mobile', name: 'Galaxy S20', width: 360, height: 800 },
  { category: 'Mobile', name: 'iPhone X / 11 Pro', width: 375, height: 812 },
  { category: 'Mobile', name: 'iPhone 13 / 14', width: 390, height: 844 },
  { category: 'Mobile', name: 'Pixel 7', width: 412, height: 915 },
  { category: 'Mobile', name: 'iPhone 14 Pro Max', width: 430, height: 932 },

  // Intermediate Mobile / Tablet boundary
  { category: 'Intermediate', name: 'Breakpoint sm-1', width: 639, height: 800 },

  // Tablet
  { category: 'Tablet', name: 'Small Tablet', width: 600, height: 800 },
  { category: 'Tablet', name: 'iPad Mini Portrait', width: 768, height: 1024 },
  { category: 'Intermediate', name: 'Breakpoint md-1', width: 767, height: 1024 },
  { category: 'Tablet', name: 'iPad Air Portrait', width: 820, height: 1180 },
  { category: 'Tablet', name: 'iPad Pro 11 Portrait', width: 834, height: 1194 },
  { category: 'Tablet', name: 'iPad Mini Landscape', width: 1024, height: 768 },
  { category: 'Tablet', name: 'iPad Pro 12.9 Portrait', width: 1024, height: 1366 },
  { category: 'Intermediate', name: 'Breakpoint lg-1', width: 1023, height: 800 },

  // Laptop / Desktop
  { category: 'Laptop/Desktop', name: 'HD Laptop', width: 1280, height: 720 },
  { category: 'Intermediate', name: 'Breakpoint xl-1', width: 1279, height: 800 },
  { category: 'Laptop/Desktop', name: 'Standard WXGA Laptop', width: 1366, height: 768 },
  { category: 'Laptop/Desktop', name: 'MacBook Pro 14', width: 1440, height: 900 },
  { category: 'Laptop/Desktop', name: 'FHD Scaled Laptop', width: 1536, height: 864 },
  { category: 'Laptop/Desktop', name: 'Full HD Desktop', width: 1920, height: 1080 }
];

const PAGES = [
  { name: 'Home', path: '/' },
  { name: 'Products', path: '/products' },
  { name: 'Product Details', path: '/products/prod_foundation' },
  { name: 'Categories', path: '/categories' },
  { name: 'Services', path: '/services' },
  { name: 'Beauty Booking Wizard', path: '/book' },
  { name: 'Shopping Bag', path: '/cart' },
  { name: 'Checkout', path: '/checkout' },
  { name: 'My Orders', path: '/orders' },
  { name: 'My Bookings', path: '/bookings' },
  { name: 'Wishlist', path: '/wishlist' },
  { name: 'Customer Profile', path: '/profile' },
  { name: 'Saved Addresses', path: '/addresses' },
  { name: 'Login', path: '/login' },
  { name: 'Register', path: '/register' },
  { name: 'Verify OTP', path: '/verify-otp' }
];

async function runAudit() {
  console.log('Starting Responsive Audit with Headless Chrome...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const auditResults = [];
  const issues = [];
  let issueCounter = 1;

  for (const pageInfo of PAGES) {
    console.log(`\nAuditing Page: ${pageInfo.name} (${pageInfo.path})`);
    const page = await browser.newPage();

    // Listen to console and page errors
    const pageErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') pageErrors.push(msg.text());
    });
    page.on('pageerror', err => pageErrors.push(err.message));

    for (const vp of VIEWPORTS) {
      await page.setViewport({ width: vp.width, height: vp.height });
      const fullUrl = `${BASE_URL}${pageInfo.path}`;

      try {
        await page.goto(fullUrl, { waitUntil: 'networkidle2', timeout: 15000 });
        await new Promise(r => setTimeout(r, 600)); // wait for layout settling

        // Inspect layout metrics
        const metrics = await page.evaluate(() => {
          const docEl = document.documentElement;
          const body = document.body;
          const scrollWidth = Math.max(docEl.scrollWidth, body.scrollWidth);
          const clientWidth = docEl.clientWidth;
          const hasHorizontalOverflow = scrollWidth > clientWidth + 1; // 1px threshold for fractional rounding

          // Find overflowing elements if any
          const overflowingElements = [];
          if (hasHorizontalOverflow) {
            const allElements = document.querySelectorAll('*');
            for (const el of allElements) {
              const rect = el.getBoundingClientRect();
              if (rect.right > clientWidth + 2) {
                const tag = el.tagName.toLowerCase();
                const cls = (el.className || '').toString().slice(0, 40);
                overflowingElements.push(`${tag}.${cls} (right: ${Math.round(rect.right)}px > ${clientWidth}px)`);
                if (overflowingElements.length >= 3) break;
              }
            }
          }

          // Check interactive touch targets < 40px on mobile
          const smallTouchTargets = [];
          if (window.innerWidth < 768) {
            const buttons = document.querySelectorAll('button, a, input, select');
            for (const btn of buttons) {
              const rect = btn.getBoundingClientRect();
              if (rect.width > 0 && rect.height > 0 && (rect.width < 32 || rect.height < 32)) {
                smallTouchTargets.push({
                  tag: btn.tagName.toLowerCase(),
                  text: (btn.innerText || btn.getAttribute('aria-label') || '').slice(0, 20),
                  w: Math.round(rect.width),
                  h: Math.round(rect.height)
                });
                if (smallTouchTargets.length >= 3) break;
              }
            }
          }

          // Check visible navigation and mobile menu
          const isMobileNavVisible = !!document.querySelector('.md\\:hidden.fixed.bottom-0');
          const isDesktopHeaderVisible = !!document.querySelector('header nav.hidden.lg\\:flex');

          return {
            scrollWidth,
            clientWidth,
            hasHorizontalOverflow,
            overflowingElements,
            smallTouchTargets,
            isMobileNavVisible,
            isDesktopHeaderVisible
          };
        });

        const status = metrics.hasHorizontalOverflow ? 'FAIL' : 'PASS';
        auditResults.push({
          page: pageInfo.name,
          path: pageInfo.path,
          device: vp.name,
          category: vp.category,
          viewport: `${vp.width}x${vp.height}`,
          hasHorizontalOverflow: metrics.hasHorizontalOverflow,
          overflowDelta: metrics.scrollWidth - metrics.clientWidth,
          status,
          overflowElements: metrics.overflowElements,
          smallTouchTargets: metrics.smallTouchTargets,
          errors: [...pageErrors]
        });

        // Record real issues found
        if (metrics.hasHorizontalOverflow) {
          const id = `R-${String(issueCounter++).padStart(3, '0')}`;
          issues.push({
            id,
            page: pageInfo.name,
            device: vp.name,
            viewport: `${vp.width}x${vp.height}`,
            issue: `Horizontal overflow detected: scrollWidth (${metrics.scrollWidth}px) exceeds viewport width (${metrics.clientWidth}px) by ${metrics.scrollWidth - metrics.clientWidth}px`,
            severity: (metrics.scrollWidth - metrics.clientWidth > 20) ? 'High' : 'Medium',
            cause: metrics.overflowElements.join(', ') || 'Unconstrained element width or negative margin',
            recommendedFix: 'Add overflow-x-hidden, wrap flex containers with min-w-0 or use responsive padding/width constraints',
            status: 'Open'
          });
        }

        // Capture required screenshot evidence
        const shouldCaptureScreenshot =
          (pageInfo.name === 'Home' && [375, 768, 1440].includes(vp.width)) ||
          (pageInfo.name === 'Products' && [375, 768, 1440].includes(vp.width)) ||
          (pageInfo.name === 'Checkout' && [375, 768, 1440].includes(vp.width)) ||
          (pageInfo.name === 'Beauty Booking Wizard' && [375, 768, 1440].includes(vp.width));

        if (shouldCaptureScreenshot) {
          let deviceLabel = 'desktop';
          if (vp.width === 375) deviceLabel = 'mobile';
          if (vp.width === 768) deviceLabel = 'tablet';

          let pageLabel = 'home';
          if (pageInfo.name === 'Products') pageLabel = 'products';
          if (pageInfo.name === 'Checkout') pageLabel = 'checkout';
          if (pageInfo.name === 'Beauty Booking Wizard') pageLabel = 'booking';

          const screenshotFile = path.join(SCREENSHOT_DIR, `${pageLabel}-${deviceLabel}.png`);
          await page.screenshot({ path: screenshotFile, fullPage: false });
          console.log(`Saved screenshot: ${screenshotFile}`);
        }

      } catch (err) {
        console.error(`Error auditing ${pageInfo.name} at ${vp.width}x${vp.height}:`, err.message);
        auditResults.push({
          page: pageInfo.name,
          path: pageInfo.path,
          device: vp.name,
          category: vp.category,
          viewport: `${vp.width}x${vp.height}`,
          status: 'ERROR',
          error: err.message
        });
      }
    }

    await page.close();
  }

  await browser.close();

  // Save audit data to JSON for report generation
  fs.writeFileSync('docs/responsive-audit/audit-data.json', JSON.stringify({ auditResults, issues }, null, 2));
  console.log(`\nAudit complete! Processed ${auditResults.length} test points across ${PAGES.length} pages.`);
  console.log(`Total issues identified: ${issues.length}`);
}

runAudit().catch(console.error);
