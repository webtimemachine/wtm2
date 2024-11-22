// test/extension.test.js
import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

// Use fileURLToPath to convert import.meta.url to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


(async () => {
    // Specify the path to the extension directory
    const extensionPath = path.resolve(__dirname, '../../../native/app_chrome');  // Root directory of the extension and manifest

    console.log("Extension Path:", extensionPath); // Log the path for debugging

    // Launch a new instance of Chrome with the extension loaded
    const browser = await puppeteer.launch({
        headless: false, // We use headless: false to see the browser while testing; set to true for CI or headless testing.
        args: [
            `--disable-extensions-except=/home/liza_saravia/wtm2/native/app_chrome`,
            `--load-extension=/home/liza_saravia/wtm2/native/app_chrome`,
        ],
    });

    // Create a new page (tab) to interact with your extension
    const page = await browser.newPage();

    // Open a new tab and navigate to a test URL, or any page where your extension should work
    await page.goto('https://webtm.io/');

    // Allow time for extension scripts to load; can be optimized
    await page.waitForTimeout(1000);


    // // Close the browser after the test is done
    await browser.close();
})();
