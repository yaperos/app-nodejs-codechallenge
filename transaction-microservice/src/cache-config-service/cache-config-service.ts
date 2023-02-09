import { CacheOptionsFactory, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import type { RedisClientOptions } from 'redis';
import { IRedisConfig } from 'src/interfaces/redis-config.interface';

@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
  constructor(private configService: ConfigService) {}

  createCacheOptions(): RedisClientOptions {
    const { host, port } = this.configService.get<IRedisConfig>('redis');

    return {
      ttl: 30,
      isGlobal: true,
      store: redisStore,
      host,
      port,
    };
  }
}
