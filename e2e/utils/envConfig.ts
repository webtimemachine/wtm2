import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  E2E_BACKEND_BASE_URL: z.string().url().nonempty(),
  E2E_WEBPAGE_BASE_URL: z.string().url().nonempty(),
  E2E_TEST_EMAIL: z.string().email().nonempty(),
  E2E_TEST_PASSWORD: z.string().min(8),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('Invalid environment variables:', parsedEnv.error.format());
  throw new Error('Environment variable validation failed');
}

export const envConfig = parsedEnv.data;
