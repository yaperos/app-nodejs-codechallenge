import { Module } from '@nestjs/common';

import { TransactionService } from './services/transaction.service';
import { TransactionResolver } from './resolvers/transaction.resolver';

@Module({
  providers: [TransactionResolver, TransactionService],
})
export class TransactionModule {}
