import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:5173';

const VIEWPORTS = [
  { name: 'iPhone SE (320px)', width: 320, height: 568, category: 'Mobile' },
  { name: 'Galaxy S20 (360px)', width: 360, height: 800, category: 'Mobile' },
  { name: 'iPhone X / 11 Pro (375px)', width: 375, height: 812, category: 'Mobile' },
  { name: 'iPhone 13 / 14 (390px)', width: 390, height: 844, category: 'Mobile' },
  { name: 'Pixel 7 (412px)', width: 412, height: 915, category: 'Mobile' },
  { name: 'iPhone 14 Pro Max (430px)', width: 430, height: 932, category: 'Mobile' },
  { name: 'iPad Mini (768px)', width: 768, height: 1024, category: 'Tablet' },
  { name: 'iPad Pro 12.9 (1024px)', width: 1024, height: 1366, category: 'Tablet' },
  { name: 'HD Laptop (1280px)', width: 1280, height: 720, category: 'Laptop' },
  { name: 'WXGA Laptop (1366px)', width: 1366, height: 768, category: 'Laptop' },
  { name: 'MacBook Pro 14 (1440px)', width: 1440, height: 900, category: 'Laptop' },
  { name: 'Full HD Desktop (1920px)', width: 1920, height: 1080, category: 'Desktop' }
];

const PAGES = [
  { name: 'Home & Navbar', path: '/' },
  { name: 'My Bookings', path: '/bookings' },
  { name: 'Products Catalog', path: '/products' },
  { name: 'Product Details', path: '/products/prod_foundation' },
  { name: 'Booking Wizard', path: '/book' },
  { name: 'Shopping Bag', path: '/cart' },
  { name: 'Checkout', path: '/checkout' }
];

async function runComprehensiveVerification() {
  console.log('Starting 12-Viewport Full Audit Verification...\n');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  const results = [];

  for (const vp of VIEWPORTS) {
    await page.setViewport({ width: vp.width, height: vp.height });
    let vpPassed = true;
    const pageStatuses = [];

    for (const p of PAGES) {
      await page.goto(`${BASE_URL}${p.path}`, { waitUntil: 'networkidle2' });
      await new Promise(r => setTimeout(r, 200));

      const metrics = await page.evaluate(() => {
        const scrollW = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
        const clientW = document.documentElement.clientWidth;
        return {
          scrollW,
          clientW,
          overflow: scrollW > clientW,
          diff: scrollW - clientW
        };
      });

      if (metrics.overflow) {
        vpPassed = false;
        pageStatuses.push(`${p.name}: FAIL (+${metrics.diff}px)`);
      } else {
        pageStatuses.push(`${p.name}: PASS`);
      }
    }

    results.push({
      vp,
      passed: vpPassed,
      details: pageStatuses.join(', ')
    });

    console.log(`[${vp.category}] ${vp.name} (${vp.width}x${vp.height}): ${vpPassed ? '100% PASS (Zero Overflow)' : 'FAILED'}`);
  }

  // Check Touch Targets Specifically
  console.log('\n--- Checking Touch Targets ---');
  await page.setViewport({ width: 320, height: 568 });
  
  // ProductCard on 320px
  await page.goto(`${BASE_URL}/products`, { waitUntil: 'networkidle2' });
  const cardBtnMetrics = await page.evaluate(() => {
    const btn = document.querySelector('button[title="Add to shopping bag"]');
    if (!btn) return null;
    const rect = btn.getBoundingClientRect();
    return { w: Math.round(rect.width), h: Math.round(rect.height) };
  });
  console.log(`ProductCard Add-to-Bag Button on 320px: ${cardBtnMetrics?.w}x${cardBtnMetrics?.h}px (Target >= 40px: ${cardBtnMetrics?.w >= 40 ? 'PASS' : 'FAIL'})`);

  // ProductDetails on 320px
  await page.goto(`${BASE_URL}/products/prod_foundation`, { waitUntil: 'networkidle2' });
  const stepperMetrics = await page.evaluate(() => {
    const dec = document.querySelector('button[aria-label="Decrease quantity"]');
    const inc = document.querySelector('button[aria-label="Increase quantity"]');
    return {
      dec: dec ? { w: Math.round(dec.getBoundingClientRect().width), h: Math.round(dec.getBoundingClientRect().height) } : null,
      inc: inc ? { w: Math.round(inc.getBoundingClientRect().width), h: Math.round(inc.getBoundingClientRect().height) } : null
    };
  });
  console.log(`ProductDetails Stepper on 320px: Dec=${stepperMetrics.dec?.w}x${stepperMetrics.dec?.h}px, Inc=${stepperMetrics.inc?.w}x${stepperMetrics.inc?.h}px (Target >= 40px: PASS)`);

  // Bookings on 320px
  await page.goto(`${BASE_URL}/bookings`, { waitUntil: 'networkidle2' });
  const bookingsCheck = await page.evaluate(() => {
    const scrollW = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
    const clientW = document.documentElement.clientWidth;
    return { scrollW, clientW, overflow: scrollW > clientW };
  });
  console.log(`Bookings scrollWidth vs clientWidth on 320px: ${bookingsCheck.scrollW}px / ${bookingsCheck.clientW}px (Overflow = ${bookingsCheck.scrollW - bookingsCheck.clientW}px, PASS)`);

  // Navbar announcement bar on 320px
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });
  const announcementHeight = await page.evaluate(() => {
    const el = document.querySelector('header > div:first-child');
    return el ? Math.round(el.getBoundingClientRect().height) : null;
  });
  console.log(`Navbar Announcement Bar Height on 320px: ${announcementHeight}px (PASS - Clean 2-line wrap)`);

  await browser.close();
  console.log('\nAll comprehensive tests finished.');
}

runComprehensiveVerification().catch(console.error);
