import { Module } from '@nestjs/common';
import { HealthModule } from './application/health/health.module';
import { LoggerModule } from './application/logger/logger.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from './infraestructure/database/config';
import { TransactionModule } from './application/transaction/transaction.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(DatabaseConfig),
    HealthModule,
    LoggerModule,
    TransactionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
