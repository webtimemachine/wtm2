import { test, expect } from '@playwright/test';
import { envConfig } from '../../utils/envConfig';

test.describe('Landing page', () => {
  test('Home page loads successfully', async ({ page }) => {
    await page.goto(`${envConfig.E2E_WEBPAGE_BASE_URL}/`);
    await expect(page).toHaveTitle('WebTM | Home');
  });

  test('Landing page has a dashboard button', async ({ page }) => {
    await page.goto(`${envConfig.E2E_WEBPAGE_BASE_URL}/`);
    const dashboardButton = page.locator('text=Dashboard');
    await expect(dashboardButton).toBeVisible();
  });

  test('Clicking dashboard button without session navigates to login page', async ({
    page,
  }) => {
    await page.goto(`${envConfig.E2E_WEBPAGE_BASE_URL}/`);
    const dashboardButton = page.locator('text=Dashboard');
    await expect(dashboardButton).toBeVisible();
    await dashboardButton.click();
    await expect(page).toHaveURL(`${envConfig.E2E_WEBPAGE_BASE_URL}/login`);
  });
});
