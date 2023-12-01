import { Module } from '@nestjs/common';
import { TransferSqlModel } from './model';

@Module({
  providers: [TransferSqlModel],
  exports: [TransferSqlModel],
})
export class TransferSqlModule {}