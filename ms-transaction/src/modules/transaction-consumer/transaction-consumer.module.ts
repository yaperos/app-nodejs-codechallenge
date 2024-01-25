import { Module } from '@nestjs/common';

import { TransactionsModule } from '../transactions/transactions.module';
import { TransactionRequestService } from './transactionRequest.service';
import { TransactionStatusService } from './transactionStatus.service';

@Module({
  imports: [TransactionsModule],
  providers: [TransactionRequestService, TransactionStatusService],
})
export class TransactionConsumerModule {}
