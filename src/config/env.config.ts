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
};

const envSchema = z.object({
  ...envSchemas,
});

export type EnvType = z.infer<typeof envSchema>;
export const appEnv: EnvType = parseEnv(process.env, envSchemas);
