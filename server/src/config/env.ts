/**
 * Environment configuration with validation
 */

import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).pipe(z.number().int().positive()).default('4000'),
  MONGODB_URI: z.string().url(),
  MONGODB_URI_TEST: z.string().url().optional(),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRE: z.string().default('7d'),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_REFRESH_EXPIRE: z.string().default('30d'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  MAX_FILE_SIZE: z
    .string()
    .transform(Number)
    .pipe(z.number().int().positive())
    .default('5242880'),
  UPLOAD_PATH: z.string().default('./uploads'),
  RATE_LIMIT_WINDOW_MS: z
    .string()
    .transform(Number)
    .pipe(z.number().int().positive())
    .default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z
    .string()
    .transform(Number)
    .pipe(z.number().int().positive())
    .default('100'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

type Env = z.infer<typeof envSchema>;

let env: Env;

try {
  env = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('❌ Invalid environment variables:');
    error.errors.forEach((err) => {
      console.error(`  - ${err.path.join('.')}: ${err.message}`);
    });
    process.exit(1);
  }
  throw error;
}

export const config = {
  ...env,
  isDevelopment: env.NODE_ENV === 'development',
  isProduction: env.NODE_ENV === 'production',
  isTest: env.NODE_ENV === 'test',
  mongodbUri: env.NODE_ENV === 'test' ? env.MONGODB_URI_TEST || env.MONGODB_URI : env.MONGODB_URI,
} as const;


