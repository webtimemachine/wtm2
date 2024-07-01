import * as dotenv from 'dotenv';
import { parseEnv } from 'znv';
import { z } from 'zod';

const isProduction = process.env.NODE_ENV === 'production';
if (isProduction) process.env.NO_COLOR = 'TRUE';

BigInt.prototype['toJSON'] = function () {
  return Number(this);
};

dotenv.config();
const envSchemas = {
  PORT: z.number(),
  BASE_URL: z.string().default('http://localhost:3000'),
  NODE_ENV: z.string().default('development'),
  DATABASE_URL: z.string(),
  DATABASE_URL_NON_POOLING: z.string(),
  BCRYPT_SALT: z.number(),
  CRYPTO_SALT: z.string(),
  CRYPTO_KEY: z.string(),
  JWT_ACCESS_SECRET: z.string(),
  JWT_ACCESS_EXPIRATION: z.string(),
  JWT_PARTIAL_SECRET: z.string(),
  JWT_PARTIAL_EXPIRATION: z.string().default('60m'),
  JWT_REFRESH_SECRET: z.string(),
  JWT_REFRESH_EXPIRATION: z.string(),
  JWT_RECOVERY_TOKEN_SECRET: z.string(),
  JWT_RECOVERY_TOKEN_EXPIRATION: z.string(),
  EMAIL_URI: z.string(),
  OPENAI_ACCESS_TOKEN: z.string(),
  WEAVIATE_HOST: z.string().default('localhost:8084'),
  WEAVIATE_SCHEME: z.string().default('http'),
  WEAVIATE_API_KEY: z.string().default('api-key'),
  SENTRY_DSN: z.string().optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),
};

const envSchema = z.object({
  ...envSchemas,
});

export type EnvType = z.infer<typeof envSchema>;
export const appEnv: EnvType = parseEnv(process.env, envSchemas);
