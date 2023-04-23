import { Global, Module } from '@nestjs/common';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';

@Global()
@Module({
    imports: [
        CacheModule.register({
            // @ts-ignore
            store: async () => await redisStore({
              // Store-specific configuration:
              socket: {
                host: 'localhost',
                port: 6379,
              }
            })
          }),
    ],
    exports: [CacheModule],
    
})
export class RedisModule {}
