import { Module } from '@nestjs/common';
import { TransactionResolver } from './transaction.resolver';

@Module({
  providers: [TransactionResolver],
})
export class TransactionModule {}
