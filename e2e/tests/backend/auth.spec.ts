import { test, expect } from '@playwright/test';
import { envConfig } from '../../utils/envConfig';

test.describe('Auth', () => {
  test('Should login successfully', async ({ request }) => {
    const response = await request.post(
      `${envConfig.E2E_BACKEND_BASE_URL}/api/auth/login`,
      {
        data: {
          deviceKey: 'test',
          userAgent: 'test',
          userAgentData: 'test',
          email: envConfig.E2E_TEST_EMAIL,
          password: envConfig.E2E_TEST_PASSWORD,
        },
      }
    );

    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body).toHaveProperty('accessToken');
    expect(body).toHaveProperty('refreshToken');
  });
});
