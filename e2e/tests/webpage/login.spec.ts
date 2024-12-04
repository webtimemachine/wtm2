import { test, expect } from '@playwright/test';
import { envConfig } from '../../utils/envConfig';

test.describe('Login Page E2E Tests', () => {
  test('Valid login', async ({ page }) => {
    await page.goto(`${envConfig.E2E_WEBPAGE_BASE_URL}/login`);

    const emailInput = page.locator('input[name="email"]');
    await emailInput.fill('liza.saraviag@gmail.com');

    const passwordInput = page.locator('input[name="password"]');
    await passwordInput.fill('Test12345');

    const signInButton = page.locator('button:has-text("Sign In")');
    await signInButton.click();

    await page.waitForURL(`${envConfig.E2E_WEBPAGE_BASE_URL}/navigation-entries`);

    await expect(page).toHaveURL(`${envConfig.E2E_WEBPAGE_BASE_URL}/navigation-entries`);
  });
});
