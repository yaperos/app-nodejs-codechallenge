import { Module } from '@nestjs/common';
import { TransactionsSubscriber } from './transacions.subscriber';
import { TransactionsService } from './transactions.service';

@Module({
  providers: [TransactionsSubscriber, TransactionsService],
})
export class TransactionsModule {}
