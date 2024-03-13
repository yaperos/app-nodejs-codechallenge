import { Module } from '@nestjs/common';
import { HealthModule } from './application/useCases/health/health.module';
import { AntiFraudModule } from './application/useCases/antiFraud/antiFraud.module';
import { TransactionModule } from './application/useCases/transaction/transaction.module';
@Module({
  imports: [HealthModule, AntiFraudModule, TransactionModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
