// apps/transaction-management-service/src/cache/cache.config.module.ts
import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true, // Make CacheManager available globally via @Inject(CACHE_MANAGER)
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get<string>('REDIS_HOST', 'localhost'),
        port: configService.get<number>('REDIS_PORT', 6379),
        ttl: configService.get<number>('CACHE_TTL', 3600), // Default TTL in seconds (e.g., 1 hour)
        // Add other Redis options if needed (password, db index, etc.)
      }),
    }),
  ],
})
export class CacheConfigModule { }