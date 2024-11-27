const puppeteer = require('puppeteer');

describe('ForgotPasswordScreen Component', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: 'new' });
    page = await browser.newPage();
    await page.goto('https://webtm.io/forgot-password'); // Change URL as needed
  });

  afterAll(async () => {
    await browser.close();
  });

  test('disables "Send Code" button when email input is empty, enables when email is provided', async () => {
    // Select the "Send Code" button by text content
    const sendCodeButton = await page.$x("//button[contains(., 'Send code')]");
    
    // Check that the button is initially disabled when the email is empty
    let isDisabled = await sendCodeButton[0].evaluate(button => button.disabled);
    expect(isDisabled).toBe(true); // Button should be disabled initially
  
    // Enter a valid email in the input field
    await page.type('input[name="email"]', 'test@example.com');
  
    // Re-check if the "Send Code" button is enabled after entering an email
    isDisabled = await sendCodeButton[0].evaluate(button => button.disabled);
    expect(isDisabled).toBe(false); // Button should be enabled now
  });

  // test(
  //   'sends code for a valid email and navigates to validation page',
  //   async () => {
  //     // Enter a valid email
  //     await page.type('input[name="email"]', 'liza.saraviag@gmail.com');
  
  //     // Select the "Send Code" button by text content and click it
  //     const sendCodeButton = await page.$x("//button[contains(., 'Send code')]");
  //     await sendCodeButton[0].click();
  
  //     // Wait for the page to navigate by checking the URL
  //     await page.waitForFunction(
  //       'window.location.href.includes("validate-recovery-code")',
  //       { timeout: 20000 } // wait for up to 20 seconds
  //     );
  
  //     // Confirm the URL changed to the validation page
  //     const currentUrl = await page.url();
  //     expect(currentUrl).toContain('validate-recovery-code');
  //   },
  //   30000 // Set a longer test timeout (30 seconds)
  // );
  

  test('navigates back to login screen when clicking back icon', async () => {
    await page.goto('https://webtm.io/forgot-password'); // Reset to Forgot Password screen
    await page.click('button[aria-label="Back icon"]'); // Click the back icon

    // Verify navigation to the login page
    await page.waitForNavigation();
    expect(page.url()).toBe('https://webtm.io/login'); // Adjust URL as necessary
  });
});
