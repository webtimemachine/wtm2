import { test, expect, chromium, BrowserContext, Page } from '@playwright/test';
import path from 'path';

const CHROME_EXTENSION_PATH = path.join(__dirname, '../../../build/app_chrome');

test.describe('Chrome Extension', () => {
  let context: BrowserContext;
  let extensionPage: Page;

  test.beforeAll(async () => {
    const browser = await chromium.launchPersistentContext('', {
      headless: false,
      args: [
        `--disable-extensions-except=${CHROME_EXTENSION_PATH}`,
        `--load-extension=${CHROME_EXTENSION_PATH}`,
      ],
    });

    context = browser;

    let extensionId: string | undefined;

    const serviceWorkers = context.serviceWorkers();
    if (serviceWorkers.length === 0) {
      await context.waitForEvent('serviceworker');
    }
    for (const worker of context.serviceWorkers()) {
      const url = worker.url();
      if (url.startsWith('chrome-extension://')) {
        extensionId = url.split('/')[2];
        break;
      }
    }

    if (!extensionId) {
      throw new Error('Could not find the extension ID');
    }

    extensionPage = await context.newPage();
    await extensionPage.goto(`chrome-extension://${extensionId}/index.html`);
  });

  test.afterAll(async () => {
    await context.close();
  });

  test('Extension loads successfully', async () => {
    extensionPage.waitForSelector('#extension-login-header');

    await extensionPage.waitForLoadState();
    const popupTitle = await extensionPage.title();
    expect(popupTitle).toContain('WTM - Vite');
  });
});
