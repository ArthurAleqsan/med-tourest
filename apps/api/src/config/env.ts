import path from 'node:path';
import dotenv from 'dotenv';
import { z } from 'zod';

// Load .env from the api app root regardless of the current working directory.
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required.'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters.'),
  JWT_EXPIRES_IN: z.string().default('1d'),
  CLIENT_URL: z.string().url().default('http://localhost:3000'),
  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD: z.string().min(8, 'ADMIN_PASSWORD must be at least 8 characters.'),
  ADMIN_FIRST_NAME: z.string().default('Site'),
  ADMIN_LAST_NAME: z.string().default('Administrator'),
  BUSINESS_TIMEZONE: z.string().default('Asia/Yerevan'),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');
    // eslint-disable-next-line no-console
    console.error(`\nInvalid environment configuration:\n${issues}\n`);
    process.exit(1);
  }
  return parsed.data;
}

export const env = loadEnv();
export const isProduction = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';
