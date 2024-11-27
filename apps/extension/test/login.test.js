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
    await page.type('input[name="email"]', 'test.user@example.com');
    await page.type('input[name="password"]', 'Test12345');

    await page.evaluate(() => {
      [...document.querySelectorAll('button')].find(button => button.textContent === 'Sign In').click();
    });

    await page.waitForNavigation();
    expect(page.url()).toBe('https://webtm.io/navigation-entries');
  });

  test('Displays error for empty email field', async () => {
    await page.waitForSelector('input[name="email"]', { visible: true });
    await page.evaluate(() => {
      document.querySelector('input[name="email"]').value = '';
    });
    await page.type('input[name="password"]', 'Test12345');

    await page.evaluate(() => {
      [...document.querySelectorAll('button')].find(button => button.textContent === 'Sign In').click();
    });

    await page.waitForSelector('.chakra-form__error-message', { visible: true });
    const errorMessage = await page.$eval('.chakra-form__error-message', el => el.textContent.trim());
    expect(errorMessage).toBe('Email is required');
  });

  // test('Displays error for empty password field', async () => {
  //   await page.waitForSelector('input[name="email"]', { visible: true });
  //   await page.type('input[name="email"]', 'test.user@example.com');
  //   await page.evaluate(() => {
  //     document.querySelector('input[name="password"]').value = '';
  //   });

  //   await page.evaluate(() => {
  //     [...document.querySelectorAll('button')].find(button => button.textContent === 'Sign In').click();
  //   });

  //   await page.waitForSelector('.chakra-form__error-message', { visible: true });
  //   const errorMessage = await page.$eval('.chakra-form__error-message', el => el.textContent.trim());
  //   expect(errorMessage).toBe('Password is required');
  // });

  // test('Displays error for invalid email format', async () => {
  //   await page.waitForSelector('input[name="email"]', { visible: true });
  //   await page.type('input[name="email"]', 'invalid-email');
  //   await page.type('input[name="password"]', 'Test12345');

  //   await page.evaluate(() => {
  //     [...document.querySelectorAll('button')].find(button => button.textContent === 'Sign In').click();
  //   });

  //   await page.waitForSelector('.chakra-form__error-message', { visible: true });
  //   const errorMessage = await page.$eval('.chakra-form__error-message', el => el.textContent.trim());
  //   expect(errorMessage).toBe('Please enter a valid email address');
  // });

  // test('Displays error for invalid credentials', async () => {
  //   await page.waitForSelector('input[name="email"]', { visible: true });
  //   await page.type('input[name="email"]', 'test.user@example.com');
  //   await page.type('input[name="password"]', 'WrongPassword');

  //   await page.evaluate(() => {
  //     [...document.querySelectorAll('button')].find(button => button.textContent === 'Sign In').click();
  //   });

  //   await page.waitForSelector('.chakra-form__error-message', { visible: true });
  //   const errorMessage = await page.$eval('.chakra-form__error-message', el => el.textContent.trim());
  //   expect(errorMessage).toBe('Invalid email or password');
  // });

  // test('Redirects to forgot password page', async () => {
  //   await page.waitForSelector('a[href="/forgot-password"]', { visible: true });
  //   await page.click('a[href="/forgot-password"]');

  //   await page.waitForNavigation();
  //   expect(page.url()).toBe('https://webtm.io/forgot-password');
  // });
});
