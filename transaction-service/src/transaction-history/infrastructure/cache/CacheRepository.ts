import { ICacheRepository } from '../../domain/repositories/cache/ICacheRepository';
import { Inject, Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CacheRepository implements OnModuleDestroy, ICacheRepository {
  constructor(
    private readonly config: ConfigService,
    @Inject('RedisClient') private readonly redisClient: Redis,
  ) {}

  onModuleDestroy(): void {
    this.redisClient.disconnect();
  }

  async get(key: string): Promise<any> {
    try {
      const data = await this.redisClient.get(
        `${this.config.get('APP_NAME')}:${key}`,
      );

      return JSON.parse(data);
    } catch (error) {
      Logger.error(`Can not get data with key: ${key}`, error.message);
    }
  }

  async set(key: string, value: string, ttl: number = 60): Promise<void> {
    try {
      await this.redisClient.set(
        `${this.config.get('APP_NAME')}:${key}`,
        JSON.stringify(value),
        'EX',
        ttl,
      );
    } catch (error) {
      Logger.error(`Can not set data with key: ${key}`, error.message);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.redisClient.del(`${this.config.get('APP_NAME')}:${key}`);
    } catch (error) {
      Logger.error(`Can not delete data with key: ${key}`, error.message);
    }
  }
}
