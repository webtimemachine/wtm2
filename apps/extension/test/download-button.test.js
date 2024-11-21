import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

// Use fileURLToPath to convert import.meta.url to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths and settings
const extensionPath = path.resolve(__dirname, '../../../native/app_chrome'); 
const appUrl = 'https://webtm.io/'; // Change to the URL where your app is running

// Map browser types to expected download data
const browserData = {
  chrome: {
    text: 'Download for Chrome',
    url: 'https://chrome.google.com/webstore/detail/dfijieibikhpelmfhkjmihgfgpoeigch',
  },
  firefox: {
    text: 'Download for Firefox',
    url: 'https://addons.mozilla.org/en-US/firefox/addon/webtm',
  },
  safari: {
    text: 'Download for Safari',
    url: 'https://apps.apple.com/ar/app/webtm/id6477404511',
  },
  brave: {
    text: 'Download for Brave',
    url: 'https://chrome.google.com/webstore/detail/dfijieibikhpelmfhkjmihgfgpoeigch',
  },
};

// Helper function to test the button for each browser type
async function testDownloadButton(browser, browserType) {
  console.log(`Testing for browser type: ${browserType}`);

  const page = await browser.newPage();

  // Simulate the browser type by setting a custom user agent (if applicable)
  if (browserType !== 'chrome') {
    await page.setUserAgent(`Mozilla/5.0 (${browserType})`);
  }

  await page.goto(appUrl);

  // Wait for the download button to appear
  await page.waitForSelector('a');

  // Extract the button text and URL
  const buttonText = await page.$eval('a', (el) => el.innerText);
  const buttonUrl = await page.$eval('a', (el) => el.href);

  // Check if the button text and URL match the expected values
  if (buttonText === browserData[browserType].text && buttonUrl === browserData[browserType].url) {
    console.log(`✅ ${browserType} button test passed.`);
  } else {
    console.error(`❌ ${browserType} button test failed.`);
  }

  await page.close();
}

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`,
    ],
  });

  for (const browserType of Object.keys(browserData)) {
    await testDownloadButton(browser, browserType);
  }

  await browser.close();
})();
