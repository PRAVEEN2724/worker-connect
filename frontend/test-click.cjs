const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err));
  
  await page.goto('http://localhost:5173/login');
  await page.fill('input[type="email"]', 'customer@gmail.com');
  await page.fill('input[type="password"]', 'customer@123');
  await page.click('button[type="submit"]');
  await page.waitForNavigation();
  
  await page.goto('http://localhost:5173/customer/search');
  await page.waitForSelector('.worker-card');
  console.log("Found worker cards, clicking Message button...");
  await page.click('button:has-text("Message")');
  await page.waitForTimeout(2000);
  console.log("Done");
  await browser.close();
})();
