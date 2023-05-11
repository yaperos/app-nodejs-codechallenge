import { Module } from '@nestjs/common';
import { TransactionController } from './transaction/transaction.controller';

@Module({
  controllers: [TransactionController]
})
export class ApiModule {}
