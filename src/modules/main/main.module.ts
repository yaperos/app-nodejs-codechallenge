import { Module } from '@nestjs/common';
import { CoreModule } from '../core/core.module';
import { TransactionModule } from '../transaction/transaction.module';
import { AntiFraudModule } from '../anti-fraud/anti-fraud.module';

@Module({
  imports: [CoreModule, TransactionModule, AntiFraudModule],
})
export class MainModule {}
