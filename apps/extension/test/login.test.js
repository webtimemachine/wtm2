import puppeteer from 'puppeteer';

describe('Login Page E2E Tests', () => {
  let browser, page;

  // Set up browser and page before each test
  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: false }); // false to see the browser actions
    page = await browser.newPage();
    await page.goto('https://webtm.io//login'); 
  });

  afterAll(async () => {
    await browser.close();
  });

  test('Valid login', async () => {
    await page.type('input[name="email"]', 'liza.saraviag@gmail.com');
    await page.type('input[name="password"]', 'Test12345');
    await page.click('button[type="submit"]');

    // Wait for navigation or success indicator (change based on actual behavior)
    await page.waitForNavigation();
    
    // Assuming successful login redirects to 'navigation-entries' page
    const url = await page.url();
    expect(url).toBe('https://webtm.io/navigation-entries'); 
  });

  test('Invalid email format', async () => {
    await page.type('input[name="email"]', 'invalidEmail');
    await page.type('input[name="password"]', 'correctPassword');
    await page.click('button[type="submit"]');

    // Check if error message appears for email input
    const emailErrorMessage = await page.$eval('.chakra-form__error-message', el => el.textContent);
    expect(emailErrorMessage).toBe('Please enter a valid email address');
  });

  test('Missing password shows error', async () => {
    await page.type('input[name="email"]', 'liza.saraviag@gmail.com');
    await page.type('input[name="password"]', '');
    await page.click('button[type="submit"]');

    // Assuming some error handling in the form
    const errorButton = await page.$('button[type="submit"]:disabled');
    expect(errorButton).toBeTruthy();
  });

  test('Sign In button disabled when inputs are invalid', async () => {
    const signInButton = await page.$('button[type="submit"]');

    // Test button is disabled if email is missing
    await page.type('input[name="email"]', '');
    await page.type('input[name="password"]', 'correctPassword');
    const isButtonDisabled1 = await page.evaluate(button => button.disabled, signInButton);
    expect(isButtonDisabled1).toBe(true);

    // Test button is disabled if password is missing
    await page.type('input[name="email"]', 'user@example.com');
    await page.type('input[name="password"]', '');
    const isButtonDisabled2 = await page.evaluate(button => button.disabled, signInButton);
    expect(isButtonDisabled2).toBe(true);

    // Test button is enabled when both inputs are valid
    await page.type('input[name="email"]', 'user@example.com');
    await page.type('input[name="password"]', 'correctPassword');
    const isButtonDisabled3 = await page.evaluate(button => button.disabled, signInButton);
    expect(isButtonDisabled3).toBe(false);
  });

  test('Toggle password visibility works', async () => {
    const showHideButton = await page.$('button:contains("Show")'); // Find the "Show" button
    await showHideButton.click(); // Click to show password

    const passwordInputType = await page.$eval('input[name="password"]', el => el.type);
    expect(passwordInputType).toBe('text'); // Check if password input is visible

    await showHideButton.click(); // Click again to hide password

    const passwordInputTypeAfterHide = await page.$eval('input[name="password"]', el => el.type);
    expect(passwordInputTypeAfterHide).toBe('password'); // Check if password is hidden
  });

  test('Redirect to forgot password page when clicked', async () => {
    await page.click('text=Forgot password?');
    await page.waitForNavigation();

    const url = await page.url();
    expect(url).toBe('https://webtm.io/forgot-password'); // Replace with actual forgot-password URL
  });

  test('Redirect to sign-up page when clicked', async () => {
    await page.click('text=Sign up');
    await page.waitForNavigation();

    const url = await page.url();
    expect(url).toBe('https://webtm.io/sign-up'); // Replace with actual sign-up URL
  });
});
