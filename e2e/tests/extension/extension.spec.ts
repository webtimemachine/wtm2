import { test, expect, chromium } from '@playwright/test';
import path from 'path';

test.describe('Chrome Extension E2E Tests', () => {
  let browser;
  let page;

  test.beforeAll(async () => {
    const extensionPath = path.resolve(__dirname, '../../../native/app_chrome');
    console.log('Extension Path:', extensionPath);

    // Launch browser with the extension loaded
    browser = await chromium.launchPersistentContext('', {
      headless: false,
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
      ],
    });

    // Open a new page
    page = await browser.newPage();

    // Navigate to the target page
    await page.goto('https://webtm.io/');
    await page.waitForTimeout(1000); // Optional wait for visual stability
  }, 20000); // Timeout for the setup

  test.afterAll(async () => {
    await browser.close();
  });

  test('Landing page renders correctly', async () => {
    // Verify the page title matches metadata
    const title = await page.title();
    expect(title).toBe('WebTM | Home');

    // Check for specific text
    const landingText = await page.locator('body').textContent();
    expect(landingText).toContain('Time Machine for your browser');
  });
});
