import { test, expect } from '@playwright/test';

const BACKEND_BASE_URL = 'http://localhost:5001';

test.describe('Auth', () => {
  test('Should register successfully', async ({ request }) => {
    const response = await request.post(`${BACKEND_BASE_URL}/api/auth/signup`, {
      data: {
        email: 'test@test.com',
        password: 'Test@1234',
        displayname: 'Test User',
      },
    });

    console.log(response);

    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body).toHaveProperty('email');
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('partialToken');
  });
});
