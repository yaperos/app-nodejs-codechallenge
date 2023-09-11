import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisCachingService } from './caching.service';
import { ProxyCachingService } from './proxy-caching.service';
import { redisStore } from 'cache-manager-redis-store';
import { CacheStore } from '@nestjs/common/cache/interfaces/cache-manager.interface'

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        const store = await redisStore({
          socket: {
            host: config.get<string>('redis.host'),
            port: config.get<number>('redis.port')
          },
        });
    
        return {
          store: store as unknown as CacheStore,
          // ttl: 60 * 60 * 24 * 7,
          ttl: 60,
        };
      },
      inject: [ConfigService]
    })
  ],
  providers: [
    RedisCachingService,
    { provide: 'CachingService', useClass: ProxyCachingService },
  ],
  exports: ['CachingService']
})
export class CachingModule {}