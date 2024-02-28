import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { RedisInterfaceRepository } from '../../../Domain/Repository';

@Injectable()
export class RedisRepository implements RedisInterfaceRepository {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  async getDataCache(key: string): Promise<object> {
    return this.cacheManager.get(key);
  }
  async setDataCache(key: string, data: object): Promise<void> {
    return this.cacheManager.set(key, data);
  }
  async deleteDataCache(key: string): Promise<void> {
    return this.cacheManager.del(key);
  }
}
