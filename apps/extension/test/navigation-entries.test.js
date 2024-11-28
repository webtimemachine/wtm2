const puppeteer = require('puppeteer');

let browser, page;

beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: false, 
    timeout: 30000,  // Increase overall timeout for Puppeteer
  });
  page = await browser.newPage();

  // Go to the login page
  await page.goto('https://webtm.io/login', { waitUntil: 'domcontentloaded' });

  // Enter login credentials
  await page.waitForSelector('input[name="email"]', { visible: true });
  await page.type('input[name="email"]', 'liza.saraviag@gmail.com');
  await page.type('input[name="password"]', 'Test12345');

  // Click "Sign In"
  await page.evaluate(() => {
    [...document.querySelectorAll('button')].find(button => button.textContent === 'Sign In').click();
  });

  // Wait for successful login or specific element after login
  await page.waitForSelector('.dashboard', { visible: true });

  console.log("Logged in successfully");

}, 30000); // Increased timeout for beforeAll

afterAll(async () => {
  console.log("Closing browser");
  await browser.close();
});

test(
  'Search functionality updates content',
  async () => {
    console.log("Navigating to navigation-entries");

    // Navigate to the desired page
    await page.goto('https://webtm.io/navigation-entries', { waitUntil: 'domcontentloaded' });

    // Perform the search
    console.log("Typing search query");
    await page.waitForSelector('input[name="search"]', { visible: true });
    await page.type('input[name="search"]', 'example query');

    console.log("Clicking the menu button");
    // Click the menu button
    await page.waitForSelector('button[aria-label="Menu"]', { visible: true });
    await page.click('button[aria-label="Menu"]');

    console.log("Waiting for search results");
    // Verify search results
    await page.waitForSelector('.search-results', { visible: true });

    const results = await page.$$eval('.search-result-item', items => items.length);

    // Assert results exist
    expect(results).toBeGreaterThan(0);
  },
  30000 // Increased timeout for this test
);
