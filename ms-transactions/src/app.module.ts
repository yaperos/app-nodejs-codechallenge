import { Module } from '@nestjs/common';
import { HealthModule } from './application/useCases/health/health.module';
import { LoggerModule } from './application/useCases/logger/logger.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from './infraestructure/database/config';
import { TransactionModule } from './application/useCases/transaction/transaction.module';
import { AntiFraudModule } from './application/useCases/antiFraud/logger.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(DatabaseConfig),
    HealthModule,
    LoggerModule,
    TransactionModule,
    AntiFraudModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
