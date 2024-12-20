import * as dotenv from 'dotenv';
import { parseEnv } from 'znv';
import { z } from 'zod';

const isProduction = process.env.NODE_ENV === 'production';
if (isProduction) process.env.NO_COLOR = 'TRUE';

BigInt.prototype['toJSON'] = function () {
  return Number(this);
};

dotenv.config();

const knownExternalClients = z.array(
  z.object({
    externalClientName: z.string(),
    externalClientId: z.string(),
  }),
);

interface KnownExternalClient {
  externalClientName: string;
  externalClientId: string;
}

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
  JWT_EXTERNAL_LOGIN_SECRET: z.string(),
  JWT_EXTERNAL_LOGIN_EXPIRATION: z.string(),
  KNOWN_EXTERNAL_CLIENTS: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (value) {
          try {
            const parsed = JSON.parse(value);
            return knownExternalClients.safeParse(parsed).success;
          } catch (_) {
            return false;
          }
        }
        return true;
      },
      { message: 'Must be a JSON string representing a string array' },
    )
    .transform((value) => {
      if (!value) return undefined;
      return [...(JSON.parse(value) as readonly KnownExternalClient[])];
    }),
  EMAIL_URI: z.string(),
  OPENAI_ACCESS_TOKEN: z.string(),
  SENTRY_DSN: z.string().optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),
  AVOID_DOMAIN_LIST: z.string().optional(),
  CRON_SECRET: z.string().optional(),
  DISCORD_LOG_WEBHOOK_URL: z.string().optional(),
  DISCORD_LOG: z.boolean().optional(),
  DISCORD_ERROR: z.boolean().optional(),
  DISCORD_FATAL: z.boolean().optional(),
  DISCORD_WARN: z.boolean().optional(),
  DISCORD_DEBUG: z.boolean().optional(),
  DISCORD_VERBOSE: z.boolean().optional(),
};

const envSchema = z.object({
  ...envSchemas,
});

export type EnvType = z.infer<typeof envSchema>;
export const appEnv: EnvType = parseEnv(
  process.env,
  envSchemas,
) as unknown as EnvType;
