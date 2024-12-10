import { test, expect } from '@playwright/test';
import { envConfig } from '../../utils/envConfig';

const browserData = {
  chrome: {
    downloadLink:
      'https://chrome.google.com/webstore/detail/dfijieibikhpelmfhkjmihgfgpoeigch',
    text: 'Download for Chrome',
  },
  firefox: {
    downloadLink: 'https://addons.mozilla.org/en-US/firefox/addon/webtm',
    text: 'Download for Firefox',
  },
  safari: {
    downloadLink: 'https://apps.apple.com/ar/app/webtm/id6477404511',
    text: 'Download for Safari',
  },
  brave: {
    downloadLink:
      'https://chrome.google.com/webstore/detail/dfijieibikhpelmfhkjmihgfgpoeigch',
    text: 'Download for Brave',
  },
};

test.beforeEach(async ({ page }) => {
  // Set up a mock environment for consistent testing
  await page.goto(`${envConfig.E2E_WEBPAGE_BASE_URL}`);
});

test.describe('DownloadButton Component', () => {
  test('Home page loads successfully', async ({ page }) => {
    await expect(page).toHaveTitle('WebTM | Home');
  });

  test('Download button displays for Chrome browser', async ({ page }) => {
    // Simulate the Chrome browser environment
    await page.evaluate(() => {
      localStorage.setItem('browserName', 'chrome'); // Mock Chrome browser
    });
  
    await page.goto(`${envConfig.E2E_WEBPAGE_BASE_URL}`);
    await page.reload(); // Reload to ensure the component re-renders
  
    const chromeText = 'Download for Chrome';
  
    // Locate the Chrome download button
    const downloadButton = page.locator(`text="${chromeText}"`);
    await expect(downloadButton).toBeVisible(); // Assert it's visible
  });  

  test('Download button navigates to correct URL for Chrome', async ({ page }) => {
    const browserType = 'chrome';
  
    // Get download link and text for the specific browser
    const { downloadLink, text } = browserData[browserType];
  
    // Simulate browser detection
    await page.evaluate((browser) => {
      localStorage.setItem('browserName', browser);
    }, browserType);
  
    await page.reload();
  
    // Locate the Link containing the button
    const downloadLinkElement = page.locator(`a:has-text("${text}")`);
    await expect(downloadLinkElement).toBeVisible();
  
    // Verify the href attribute
    const hrefAttribute = await downloadLinkElement.getAttribute('href');
    expect(hrefAttribute).toBe(downloadLink);
  });

});
