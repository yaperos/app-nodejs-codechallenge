import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-store';
import { TransactionsModule } from './transactions/transactions.module';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      ttl: 10,
      // @ts-ignore
      store: async () =>
        await redisStore({
          // Store-specific configuration:
          socket: {
            host: 'host.docker.internal',
            port: 6379,
          },
        }),
    }),    
    TransactionsModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
