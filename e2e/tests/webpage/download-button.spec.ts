import { test, expect } from '@playwright/test';
import { envConfig } from '../../utils/envConfig';

test.describe('Landing page', () => {
  test('Home page loads successfully', async ({ page }) => {
    await page.goto(`${envConfig.E2E_WEBPAGE_BASE_URL}/`);
    await expect(page).toHaveTitle('WebTM | Home');
  });

  test('Landing page has a download button', async ({ page }) => {
    await page.goto(`${envConfig.E2E_WEBPAGE_BASE_URL}/`);
    const downloadButton = page.locator('text=Download');
    await expect(downloadButton).toBeVisible();
  });

  test('Download button navigates to correct URL for each browser type', async ({ page }) => {
    const browserTypes = ['chrome', 'firefox', 'safari', 'brave'];
    const browserSelectors = {
      chrome: 'a[href*="chrome.google.com/webstore"]',
      firefox: 'a[href*="addons.mozilla.org"]',
      safari: 'a[href*="apps.apple.com"]',
      brave: 'a[href*="chrome.google.com/webstore"]',
    };

    for (const browserType of browserTypes) {
      console.log(`Testing download button for browser type: ${browserType}`);

      await page.goto(`${envConfig.E2E_WEBPAGE_BASE_URL}/`);

      await page.evaluate((browserType) => {
        localStorage.setItem('browserName', browserType);
      }, browserType);

      await page.reload();

      const buttonSelector = browserSelectors[browserType];
      if (!buttonSelector) {
        throw new Error(`Unknown browser type: ${browserType}`);
      }

      const downloadButton = page.locator(buttonSelector);
      await expect(downloadButton).toBeVisible();
      console.log(`✅ Download button test passed for ${browserType}.`);
    }
  });

  test('Clicking the download button navigates to correct URL', async ({ page }) => {
    const browserTypes = ['chrome', 'firefox', 'safari', 'brave'];
    const expectedURLs = {
      chrome: 'https://chrome.google.com/webstore',
      firefox: 'https://addons.mozilla.org',
      safari: 'https://apps.apple.com',
      brave: 'https://chrome.google.com/webstore',
    };

    for (const browserType of browserTypes) {
      console.log(`Testing navigation for download button: ${browserType}`);

      await page.goto(`${envConfig.E2E_WEBPAGE_BASE_URL}/`);

      await page.evaluate((browserType) => {
        localStorage.setItem('browserName', browserType);
      }, browserType);

      await page.reload();

      const downloadButton = page.locator(
        `a[href*="${expectedURLs[browserType]}"]`
      );
      await expect(downloadButton).toBeVisible();

      await downloadButton.click();
      await expect(page).toHaveURL(new RegExp(expectedURLs[browserType]));

      console.log(`✅ Navigation test passed for ${browserType}.`);
    }
  });
});
