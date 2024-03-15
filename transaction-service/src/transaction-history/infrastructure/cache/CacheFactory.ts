import { FactoryProvider } from '@nestjs/common';
import Redis from 'ioredis';

export const RedisClientFactory: FactoryProvider<Redis> = {
  provide: 'RedisClient',
  useFactory: () => {
    const redisInstance = new Redis({
      host: process.env.REDIS_HOST,
      port: +process.env.REDIS_PORT,
      connectTimeout: +process.env.REDIS_TIMEOUT,
      keyPrefix: process.env.APP_NAME,
      commandTimeout: 400,
      maxRetriesPerRequest: 2,
      retryStrategy: () => 60000,
    });

    redisInstance.on('error', (e) => {
      throw new Error(`Redis connection failed: ${e}`);
    });

    return redisInstance;
  },
  inject: [],
};
