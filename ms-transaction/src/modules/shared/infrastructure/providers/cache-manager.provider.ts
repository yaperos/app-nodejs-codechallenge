import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CacheProvider } from 'src/modules/shared/domain/providers/cache.provider';

export class CacheManagerProvider implements CacheProvider {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async get(key: string): Promise<any> {
    return this.cache.get<any>(key);
  }
  async set(key: string, data: any): Promise<void> {
    await this.cache.set(key, data);
  }
  async delete(key: string): Promise<void> {
    await this.cache.del(key);
  }
}
