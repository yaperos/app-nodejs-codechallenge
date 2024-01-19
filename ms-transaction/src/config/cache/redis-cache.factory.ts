import { CacheModuleOptions, CacheOptionsFactory } from '@nestjs/cache-manager';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';

import { REDIS_CACHE_CONFIG_KEY, RedisCacheConfig } from './redis-cache.config';

@Injectable()
export class RedisCacheFactory implements CacheOptionsFactory {
  private readonly config: RedisCacheConfig;

  constructor(private configService: ConfigService) {
    this.config = this.configService.get<RedisCacheConfig>(
      REDIS_CACHE_CONFIG_KEY,
    );
  }

  createCacheOptions(): CacheModuleOptions {
    if (this.configService.get<string>('NODE_ENV') !== 'test') {
      return {
        store: async () =>
          await redisStore({
            socket: {
              host: this.config.host,
              port: this.config.port,
            },
          }),
        ttl: this.config.ttlInSeconds * 1000,
      };
    } else {
      return {
        ttl: 0,
      };
    }
  }
}
