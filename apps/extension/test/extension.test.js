// test/extension.test.js
const puppeteer = require('puppeteer');
const path = require('path');

let browser;
let page;

describe('Chrome Extension E2E Tests', () => {
    beforeAll(async () => {
        const extensionPath = path.resolve(__dirname, '../../../native/app_chrome');
        console.log("Extension Path:", extensionPath);

        browser = await puppeteer.launch({
            headless: false,
            args: [
                `--disable-extensions-except=${extensionPath}`,
                `--load-extension=${extensionPath}`,
            ],
        });

        page = await browser.newPage();
        await page.goto('https://webtm.io/');
        await page.waitForTimeout(1000);
    }, 20000); // Increase timeout to 20 seconds

    afterAll(async () => {
        await browser.close();
    });

    test('Landing page renders correctly', async () => {
        // Verify the page title matches metadata
        const title = await page.title();
        expect(title).toBe('WebTM | Home'); 

        // Check for specific text
        const landingText = await page.evaluate(() => {
            return document.body.textContent.includes("Time Machine for your browser");
        });
        expect(landingText).toBe(true);
    });
});
