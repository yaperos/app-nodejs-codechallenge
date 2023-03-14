import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { environment } from '@core/config/environment';
import { RedisCacheService } from './redis.cache.service';
 

@Module({
  imports: [
    RedisModule.forRootAsync({
      useFactory: () => ({
        readyLog: true,
        errorLog: true,
        config: {
          host: environment.cacheConfig.host,
          port: environment.cacheConfig.port,
          username: environment.cacheConfig.username,
          password: environment.cacheConfig.passsword,
        },
      }),
    }),
  ],
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class RedisCacheModule {}
