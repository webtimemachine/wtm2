// test/extension.test.js
import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

// Use fileURLToPath to convert import.meta.url to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("Extension Path:", extensionPath); // Log the path for debugging

(async () => {
    // Specify the path to the extension directory
    const extensionPath = path.resolve(__dirname, '..');  // Root directory of the extension

    // Launch a new instance of Chrome with the extension loaded
    const browser = await puppeteer.launch({
        headless: false, // We use headless: false to see the browser while testing; set to true for CI or headless testing.
        args: [
            `--disable-extensions-except=${extensionPath}`,
            `--load-extension=${extensionPath}`,
        ],
    });

    // Create a new page (tab) to interact with your extension
    const page = await browser.newPage();

    // Open a new tab and navigate to a test URL, or any page where your extension should work
    await page.goto('https://www.example.com');

    // Allow time for extension scripts to load; can be optimized
    await page.waitForTimeout(1000);

    // Locate elements from your extension UI, if any, using the Chrome DevTools extension API or page selectors
    // For example, let's say your extension adds a button with the id 'my-extension-button'
    const button = await page.$('#my-extension-button');
    if (button) {
        // Interact with your extension as a user would
        await button.click();

        // Add assertions to confirm expected behavior
        // For instance, checking if a certain text or element is present after the click
        const result = await page.$eval('#result-element', el => el.textContent);
        console.log(result); // Adjust assertions as needed to validate behavior
    } else {
        console.error('Extension button not found!');
    }

    // Close the browser after the test is done
    await browser.close();
})();
