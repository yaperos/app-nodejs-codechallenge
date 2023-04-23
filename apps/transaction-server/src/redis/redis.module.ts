import { Global, Module } from '@nestjs/common';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
    imports: [
      ConfigModule.forRoot(),
        CacheModule.register({
            // @ts-ignore
            store: async () => await redisStore({
              // Store-specific configuration:
              socket: {
                host: process.env.REDIS_HOST,
                port: Number(process.env.REDIS_PORT),
              }
            })
          }),
    ],
    exports: [CacheModule],
    
})
export class RedisModule {}
