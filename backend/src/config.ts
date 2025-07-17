import { z } from 'zod';

const envSchema = z.object({
  OPENAI_API_KEY: z.string().min(1),
  REDIS_HOST: z.string().min(1),
  REDIS_PORT: z.number().int(),
  REDIS_PASSWORD: z.string().min(1),
  REDIS_DB: z.number().int(),
});

const env = envSchema.parse(process.env);

export const config = {
  OPENAI_API_KEY: env.OPENAI_API_KEY,
  REDIS_HOST: env.REDIS_HOST,
  REDIS_PORT: env.REDIS_PORT,
  REDIS_PASSWORD: env.REDIS_PASSWORD,
  REDIS_DB: env.REDIS_DB,
};
