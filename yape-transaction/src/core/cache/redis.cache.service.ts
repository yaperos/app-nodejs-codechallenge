import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable, Logger } from '@nestjs/common';
import { environment } from '@core/config/environment';
import Redis from 'ioredis';
import { Transaction } from '../../modules/transaction';

@Injectable()
export class RedisCacheService {
  private readonly logger = new Logger(RedisCacheService.name);
  private readonly cacheExpiration = environment.cacheConfig.ttl;

  constructor(
    @InjectRedis(environment.cacheConfig.name) private readonly redis: Redis,
  ) {}

  async set(key: string, value: string): Promise<void> {
    await this.redis.set(key, value, 'EX', this.cacheExpiration);
  }

  async get(key: string): Promise<string> {
    return await this.redis.get(key);
  }

  async saveTransaction(id: string, transaction: Transaction): Promise<void> {
    this.logger.log('Saving transaction to cache redis');
    try {
      await this.set(id, JSON.stringify(transaction));
      this.logger.log('Successfully saved transaction to cache redis');
    } catch (error) {
      this.logger.error(error);
    }
  }

  async getTransaction(id: string): Promise<Transaction> {
    try {
      const transaction = await this.get(id);
      const transactionObject = JSON.parse(transaction);
      this.logger.log({
        message: 'Get transaction from cache redis',
        transactionObject,
      });
      return transactionObject;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
