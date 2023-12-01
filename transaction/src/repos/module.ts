import { Module } from '@nestjs/common';
import { TransactionSqlModel } from './transaction/model';

@Module({
  providers: [TransactionSqlModel],
  exports: [TransactionSqlModel],
})
export class TransactionSqlModule {}