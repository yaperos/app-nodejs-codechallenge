import { Module } from '@nestjs/common';
import { TransactionSqlModel } from './model';

@Module({
  providers: [TransactionSqlModel],
  exports: [TransactionSqlModel],
})
export class TransactionSqlModule {}