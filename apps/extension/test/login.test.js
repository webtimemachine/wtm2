const puppeteer = require('puppeteer');

describe('Login Page E2E Tests', () => {
  let browser, page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: false }); // Set to true for headless mode
    page = await browser.newPage();
    await page.goto('https://webtm.io/login');
  });

  afterAll(async () => {
    await browser.close();
  });

  test('Valid login', async () => {
    await page.waitForSelector('input[name="email"]', { visible: true });
    await page.type('input[name="email"]', 'liza.saraviag@gmail.com');
    await page.type('input[name="password"]', 'Test12345');

    await page.evaluate(() => {
      [...document.querySelectorAll('button')].find(button => button.textContent === 'Sign In').click();
    });

    await page.waitForNavigation();
    expect(page.url()).toBe('https://webtm.io/navigation-entries');
  });

});
