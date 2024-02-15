import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async create(key: string, value: unknown): Promise<void> {
    await this.cacheManager.set(key, value, 60000);
  }

  async getOne(key: string): Promise<unknown> {
    return this.cacheManager.get(key);
  }

  async update(key: string, value: unknown): Promise<unknown> {
    return this.create(key, value);
  }

  async delete(key: string): Promise<unknown> {
    return this.cacheManager.del(key);
  }
}
