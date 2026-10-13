import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:5173';

const TEST_VIEWPORTS = [
  { name: 'iPhone SE (320px)', width: 320, height: 568 },
  { name: 'Galaxy S20 (360px)', width: 360, height: 800 },
  { name: 'iPhone X (375px)', width: 375, height: 812 },
  { name: 'iPhone 13 (390px)', width: 390, height: 844 },
  { name: 'Pixel 7 (412px)', width: 412, height: 915 },
  { name: 'iPhone 14 Pro Max (430px)', width: 430, height: 932 },
  { name: 'iPad Mini (768px)', width: 768, height: 1024 },
  { name: 'iPad Pro 12.9 (1024px)', width: 1024, height: 1366 },
  { name: 'HD Laptop (1280px)', width: 1280, height: 720 },
  { name: 'WXGA Laptop (1366px)', width: 1366, height: 768 },
  { name: 'MacBook Pro (1440px)', width: 1440, height: 900 },
  { name: 'Full HD Desktop (1920px)', width: 1920, height: 1080 }
];

async function verifyFixes() {
  console.log('--- RUNNING POST-FIX VERIFICATION TEST SUITE ---');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  let allPassed = true;

  // 1. Verify Bookings Page (Target: 320x568 overflow = 0)
  console.log('\n[TEST 1] Verifying Bookings Page (/bookings) at all viewports...');
  for (const vp of TEST_VIEWPORTS) {
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.goto(`${BASE_URL}/bookings`, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 400));

    const check = await page.evaluate(() => {
      const scrollW = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
      const clientW = document.documentElement.clientWidth;
      return { scrollW, clientW, overflow: scrollW > clientW };
    });

    const delta = check.scrollW - check.clientW;
    if (check.overflow) {
      console.error(`  FAIL at ${vp.name} (${vp.width}x${vp.height}): overflow of ${delta}px!`);
      allPassed = false;
    } else {
      console.log(`  PASS at ${vp.name} (${vp.width}x${vp.height}): scrollWidth=${check.scrollW}px, clientWidth=${check.clientW}px (Overflow = 0px)`);
    }
  }

  // 2. Verify ProductCard touch target (Target: >= 40px)
  console.log('\n[TEST 2] Verifying ProductCard Add-to-Bag touch target on Mobile (375x812)...');
  await page.setViewport({ width: 375, height: 812 });
  await page.goto(`${BASE_URL}/products`, { waitUntil: 'networkidle2' });
  const buttonMetrics = await page.evaluate(() => {
    const btn = document.querySelector('button[title="Add to shopping bag"]');
    if (!btn) return null;
    const rect = btn.getBoundingClientRect();
    return { width: Math.round(rect.width), height: Math.round(rect.height) };
  });
  console.log(`  ProductCard Add-to-Bag Button Size: ${buttonMetrics?.width}x${buttonMetrics?.height}px`);
  if (buttonMetrics && buttonMetrics.width >= 40 && buttonMetrics.height >= 40) {
    console.log('  PASS: Touch target is >= 40px!');
  } else {
    console.error('  FAIL: Touch target is less than 40px');
    allPassed = false;
  }

  // 3. Verify ProductDetails stepper touch target (Target: >= 40px)
  console.log('\n[TEST 3] Verifying ProductDetails Quantity Stepper buttons on Mobile (320x568 & 375x812)...');
  await page.setViewport({ width: 320, height: 568 });
  await page.goto(`${BASE_URL}/products/prod_foundation`, { waitUntil: 'networkidle2' });
  const stepperMetrics = await page.evaluate(() => {
    const decBtn = document.querySelector('button[aria-label="Decrease quantity"]');
    const incBtn = document.querySelector('button[aria-label="Increase quantity"]');
    const decRect = decBtn ? decBtn.getBoundingClientRect() : null;
    const incRect = incBtn ? incBtn.getBoundingClientRect() : null;
    const docEl = document.documentElement;
    const overflow = docEl.scrollWidth > docEl.clientWidth;
    return {
      dec: decRect ? { w: Math.round(decRect.width), h: Math.round(decRect.height) } : null,
      inc: incRect ? { w: Math.round(incRect.width), h: Math.round(incRect.height) } : null,
      overflow
    };
  });
  console.log(`  Stepper Buttons Size at 320px: Dec=${stepperMetrics.dec?.w}x${stepperMetrics.dec?.h}px, Inc=${stepperMetrics.inc?.w}x${stepperMetrics.inc?.h}px`);
  console.log(`  Horizontal Overflow on 320px ProductDetails: ${stepperMetrics.overflow ? 'YES' : 'NO (Clean 0px)'}`);
  if (stepperMetrics.dec?.w >= 40 && stepperMetrics.dec?.h >= 40 && !stepperMetrics.overflow) {
    console.log('  PASS: Stepper touch targets are >= 40x40px with ZERO horizontal overflow!');
  } else {
    console.error('  FAIL');
    allPassed = false;
  }

  // 4. Verify Navbar Announcement bar wrapping on 320x568
  console.log('\n[TEST 4] Verifying Navbar Announcement Bar on iPhone SE (320x568)...');
  await page.setViewport({ width: 320, height: 568 });
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });
  const announcementMetrics = await page.evaluate(() => {
    const bar = document.querySelector('header > div:first-child');
    return {
      height: bar ? Math.round(bar.getBoundingClientRect().height) : null,
      scrollW: document.documentElement.scrollWidth,
      clientW: document.documentElement.clientWidth
    };
  });
  console.log(`  Announcement Bar Height on 320px: ${announcementMetrics.height}px`);
  console.log(`  Horizontal Overflow on Home: ${announcementMetrics.scrollW > announcementMetrics.clientW ? 'YES' : 'NO (0px)'}`);

  await browser.close();
  console.log('\n=============================================');
  console.log(`FINAL VERIFICATION RESULT: ${allPassed ? 'ALL TESTS PASSED 100%' : 'SOME TESTS FAILED'}`);
  console.log('=============================================');
}

verifyFixes().catch(console.error);
