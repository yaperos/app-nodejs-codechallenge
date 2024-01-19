import { CacheModule as CacheManagerModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { redisCacheConfigFactory } from './redis-cache.config';
import { RedisCacheFactory } from './redis-cache.factory';

@Module({
  imports: [
    CacheManagerModule.registerAsync({
      imports: [ConfigModule.forFeature(redisCacheConfigFactory)],
      inject: [ConfigService],
      useClass: RedisCacheFactory,
      isGlobal: true,
    }),
  ],
})
export class CacheModule {}
