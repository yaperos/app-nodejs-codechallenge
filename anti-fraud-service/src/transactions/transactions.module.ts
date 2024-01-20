import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';

@Module({
  providers: [TransactionsService],
})
export class TransactionsModule {}
