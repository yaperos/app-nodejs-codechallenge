import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { transactionStatusProviders } from './transaction-status.providers';
import { TransactionStatusService } from './transaction-status.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...transactionStatusProviders,
    TransactionStatusService
  ],
  exports: [TransactionStatusService]
})
export class TransactionStatusModule {}