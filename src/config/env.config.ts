import * as dotenv from 'dotenv';
import { parseEnv } from 'znv';
import { z } from 'zod';

const isProduction = process.env.NODE_ENV === 'production';
if (isProduction) process.env.NO_COLOR = 'TRUE';

dotenv.config();
const envSchemas = {
  PORT: z.number(),
  BASE_URL: z.string().default('http://localhost:3000'),
  NODE_ENV: z.string().default('development'),
  DATABASE_URL: z.string(),
  DIRECT_URL: z.string(),
  BCRYPT_SALT: z.number(),
  CRYPTO_SALT: z.string(),
  CRYPTO_KEY: z.string(),
  JWT_ACCESS_SECRET: z.string(),
  JWT_ACCESS_EXPIRATION: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_REFRESH_EXPIRATION: z.string(),
};

const envSchema = z.object({
  ...envSchemas,
});

export type EnvType = z.infer<typeof envSchema>;
export const appEnv: EnvType = parseEnv(process.env, envSchemas);
