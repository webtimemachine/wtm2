const puppeteer = require('puppeteer');

const EXTENSION_PATH = './';
const EXTENSION_ID = 'jehffhfomjjbanliephemabgodoingip';

let browser;

beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: false,
    args: [
      `--disable-extensions-except=${EXTENSION_PATH}`,
      `--load-extension=${EXTENSION_PATH}`,
      '--headless=new'
    ]
  });
});

afterEach(async () => {
  await browser.close();
  browser = undefined;
});

test('Sign in popup renders correctly', async () => {
  const page = await browser.newPage();
  await page.goto(`chrome-extension://${EXTENSION_ID}/popup-sign-in.html`);

  // Extracting all elements with a specific tag using a CSS selector
  const h1 = await page.$$('h1');
  expect(h1.length).toBe(1);
});

test('Fill Sign in form and navigate to popup.html', async () => {
  const page = await browser.newPage();
  await page.goto(`chrome-extension://${EXTENSION_ID}/popup-sign-in.html`);

  await page.type('#email', 'jmartel@intermediait.com');
  await page.type('#password', 'password');

  await page.click('#submit');

  await page.waitForNavigation();

  expect(page.url()).toBe(`chrome-extension://${EXTENSION_ID}/popup.html`);
});