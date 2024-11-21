import puppeteer from 'puppeteer';

(async () => {
  const appUrl = 'https://webtm.io';  
  const browserTypes = ['chrome', 'firefox', 'safari', 'brave'];
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  
  const page = await browser.newPage();
  await page.goto(appUrl);
  
  for (const browserType of browserTypes) {
    console.log(`Testing for browser type: ${browserType}`);

    // Inject JavaScript to set the browser type in localStorage, emulating `getBrowser()` results
    await page.evaluate((browserType) => {
      localStorage.setItem('browserName', browserType);
    }, browserType);

    // Reload the page so that the app re-evaluates the browser type
    await page.reload();

    // Wait for the button to appear (modify the selector based on inspection results)
    let buttonSelector;
    switch (browserType) {
      case 'chrome':
        buttonSelector = 'a[href*="chrome.google.com/webstore"]'; 
        break;
      case 'firefox':
        buttonSelector = 'a[href*="addons.mozilla.org"]';
        break;
      case 'safari':
        buttonSelector = 'a[href*="apps.apple.com"]';
        break;
      case 'brave':
        buttonSelector = 'a[href*="chrome.google.com/webstore"]';
        break;
      default:
        console.error(`Unknown browser type: ${browserType}`);
        continue;
    }

    try {
      await page.waitForSelector(buttonSelector, { timeout: 3000 });
      console.log(`✅ ${browserType} button test passed.`);
    } catch (error) {
      console.error(`❌ ${browserType} button test failed.`);
    }
  }

  await browser.close();
})();
