import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

export const redisConfig = createClient({
  url: process.env.REDIS_HOST || 'redis://localhost:6379',
  password: process.env.REDIS_PASSWORD || 'eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81'
});
