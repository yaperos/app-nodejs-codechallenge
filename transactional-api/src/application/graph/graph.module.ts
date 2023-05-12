import { Module } from '@nestjs/common';
import { TransactionResolver } from './transaction/transaction.resolver';

@Module({
  providers: [TransactionResolver]
})
export class GraphModule {}
