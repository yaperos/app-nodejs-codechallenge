import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';

export class DataAccessService {
  protected readonly logger: Logger;

  constructor(
    protected cacheManager: Cache,
    protected configService: ConfigService,
    protected baseCacheKey: string,
    serviceName: string,
  ) {
    this.logger = new Logger(serviceName);
  }

  protected cacheKey(uniqueKey: string): string {
    return `${this.baseCacheKey}|${uniqueKey}`;
  }

  protected async findOrFetchFromDatabase<T>(
    itemCacheKey: string,
    dbQuery: () => Promise<T | null>,
  ): Promise<T | null> {
    let record: T;

    record = await this.cacheManager.get<T>(itemCacheKey);
    if (record) return record;

    record = await dbQuery();
    if (!record) return null;

    await this.cacheManager.set(
      itemCacheKey,
      record,
      this.configService.get('CACHE_TTL'),
    );

    return record;
  }
}
