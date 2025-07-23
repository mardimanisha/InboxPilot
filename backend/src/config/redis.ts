import dotenv from 'dotenv';

dotenv.config();

export const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD,
  tls: process.env.REDIS_TLS === 'true' ? {}
    : process.env.NODE_ENV === 'production' && !process.env.REDIS_TLS
    ? { rejectUnauthorized: false }
    : undefined,
  enableTLSForSentinelMode: process.env.REDIS_SENTINEL === 'true',
};

export default redisConfig;
