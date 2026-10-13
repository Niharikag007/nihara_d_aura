import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testSearchDropdown() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true
  });
  const page = await browser.newPage();

  // Desktop
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173/wishlist', { waitUntil: 'networkidle0' });
  const desktopBtn = await page.$('button[aria-label="Open Search"]');
  if (desktopBtn) {
    await desktopBtn.click();
    await new Promise((r) => setTimeout(r, 500));
  }
  await page.screenshot({ path: 'docs/responsive-audit/screenshots/search-under-navbar-desktop.png' });

  // Mobile
  await page.setViewport({ width: 375, height: 812 });
  await page.goto('http://localhost:5173/wishlist', { waitUntil: 'networkidle0' });
  const mobileBtn = await page.$('button[aria-label="Open Search"]');
  if (mobileBtn) {
    await mobileBtn.click();
    await new Promise((r) => setTimeout(r, 500));
  }
  await page.screenshot({ path: 'docs/responsive-audit/screenshots/search-under-navbar-mobile.png' });

  // Mobile 320px
  await page.setViewport({ width: 320, height: 568 });
  const hasOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  console.log('Mobile 320px overflow with search open:', hasOverflow);

  await browser.close();
  console.log('Search screenshots captured!');
}

testSearchDropdown().catch(console.error);
