import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';

// Infrastructure
import { databaseConfig } from './infrastructure/config/database.config';
import { GlobalExceptionFilter } from './infrastructure/config/global-exception.filter';
import { HealthController } from './infrastructure/controllers/health.controller';
import { WinstonLoggerAdapter } from './infrastructure/adapters/logging/winston-logger.adapter';

// Modules
import { TransactionModule } from './transaction.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(databaseConfig),
    TransactionModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: 'LoggerPort',
      useClass: WinstonLoggerAdapter,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {} 