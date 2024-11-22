const puppeteer = require('puppeteer');

describe('Login Page E2E Tests', () => {
  let page;

  beforeAll(async () => {
    page = await browser.newPage();
    await page.goto('https://webtm.io/login');
  });

  afterAll(async () => {
    await page.close();
  });

  test('Valid login', async () => {
    await page.type('input[name="email"]', 'liza.saraviag@gmail.com');
    await page.type('input[name="password"]', 'Test12345');

     // Wait for the button to appear and click it by text content
     await page.waitForSelector('button', { visible: true });
     await page.evaluate(() => {
         [...document.querySelectorAll('button')].find(button => button.textContent === 'Sign In').click();
     });
    
    // Wait for navigation or a specific success indicator
    await page.waitForNavigation();
    
    // Assuming successful login redirects to 'navigation-entries' page
    expect(page.url()).toBe('https://webtm.io/navigation-entries');
  });
});
