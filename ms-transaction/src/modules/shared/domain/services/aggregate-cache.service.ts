import { Inject } from '@nestjs/common';

import { AggregateRoot } from '../aggregate-root';
import {
  CACHE_PROVIDER_ALIAS,
  CacheProvider,
} from '../providers/cache.provider';

export class AggregateCacheService<T extends AggregateRoot> {
  constructor(
    @Inject(CACHE_PROVIDER_ALIAS) private readonly cacheProvider: CacheProvider,
  ) {}

  async get(aggregateKey: string): Promise<any | null> {
    const aggregateValues = await this.cacheProvider.get(aggregateKey);
    return aggregateValues ?? null;
  }

  async set(aggregateKey: string, aggregate: T): Promise<void> {
    await this.cacheProvider.set(aggregateKey, aggregate.toPrimitives());
  }

  async delete(aggregateKey: string): Promise<void> {
    await this.cacheProvider.delete(aggregateKey);
  }
}
