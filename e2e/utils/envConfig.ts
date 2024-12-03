import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

export const envConfig = {
  E2E_BACKEND_BASE_URL: process.env.E2E_BACKEND_BASE_URL,
  E2E_TEST_EMAIL: process.env.E2E_TEST_EMAIL,
  E2E_TEST_PASSWORD: process.env.E2E_TEST_PASSWORD,
  E2E_WEBPAGE_BASE_URL: process.env.E2E_WEBPAGE_BASE_URL,
};
