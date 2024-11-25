const puppeteer = require('puppeteer');

const appUrl = 'https://webtm.io';
const browserTypes = ['chrome', 'firefox', 'safari', 'brave'];

const browserSelectors = {
  chrome: 'a[href*="chrome.google.com/webstore"]',
  firefox: 'a[href*="addons.mozilla.org"]',
  safari: 'a[href*="apps.apple.com"]',
  brave: 'a[href*="chrome.google.com/webstore"]',
};

describe('Browser Type Button Tests', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    page = await browser.newPage();
    await page.goto(appUrl);
  });

  afterAll(async () => {
    await browser.close();
  });

  test.each(browserTypes)('should display the correct button for %s', async (browserType) => {
    console.log(`Testing for browser type: ${browserType}`);

    // Set browser type in localStorage
    await page.evaluate((browserType) => {
      localStorage.setItem('browserName', browserType);
    }, browserType);

    // Reload the page to apply changes
    await page.reload();

    // Get the selector for the current browser type
    const buttonSelector = browserSelectors[browserType];
    if (!buttonSelector) {
      throw new Error(`Unknown browser type: ${browserType}`);
    }

    try {
      // Check if the button is present
      await page.waitForSelector(buttonSelector, { timeout: 3000 });
      console.log(`✅ ${browserType} button test passed.`);
    } catch (error) {
      console.error(`❌ ${browserType} button test failed.`);
      throw error; // Fail the test if the button is not found
    }
  });
});
