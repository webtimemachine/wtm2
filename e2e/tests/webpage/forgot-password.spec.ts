import { test, expect } from '@playwright/test';
import { envConfig } from '../../utils/envConfig';

test.describe('ForgotPasswordScreen Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${envConfig.E2E_WEBPAGE_BASE_URL}/forgot-password`);
  });

  test('disables "Send Code" button when email input is empty, enables when email is provided', async ({ page }) => {
    const sendCodeButton = page.locator('button:has-text("Send code")');

    await expect(sendCodeButton).toBeDisabled();

    const emailInput = page.locator('input[name="email"]');
    await emailInput.fill('test@example.com');

    await expect(sendCodeButton).toBeEnabled();
  });

  test('navigates back to login screen when clicking back icon', async ({ page }) => {
    const backIconButton = page.locator('button[aria-label="Back icon"]');
    await backIconButton.click();

    await expect(page).toHaveURL(`${envConfig.E2E_WEBPAGE_BASE_URL}/login`);
  });
});
