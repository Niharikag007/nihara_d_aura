import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function verifyGradient() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true
  });
  const page = await browser.newPage();

  // 1. Home desktop
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'docs/responsive-audit/screenshots/site-gradient-home-desktop.png' });

  // 2. Home mobile
  await page.setViewport({ width: 375, height: 812 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'docs/responsive-audit/screenshots/site-gradient-home-mobile.png' });

  // 3. Products desktop
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173/products', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'docs/responsive-audit/screenshots/site-gradient-products.png' });

  // 4. Wishlist desktop
  await page.goto('http://localhost:5173/wishlist', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'docs/responsive-audit/screenshots/site-gradient-wishlist.png' });

  console.log('Site-wide gradient screenshots captured successfully!');
  await browser.close();
}

verifyGradient().catch(console.error);
