import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { type Env, validateEnv } from './config/env';
import { TransactionsController } from './routes/transactions.controller';
import { HealthController } from './routes/health.controller';
import { ProxyService } from './proxy/proxy.service';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<Env, true>) => [
        {
          ttl: config.get('RATE_LIMIT_TTL_MS', { infer: true }),
          limit: config.get('RATE_LIMIT_MAX', { infer: true }),
        },
      ],
    }),
  ],
  controllers: [TransactionsController, HealthController],
  providers: [ProxyService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule { }