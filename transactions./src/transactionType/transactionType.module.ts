import { Module } from '@nestjs/common';
import { TransactionTypeController } from './transactionType.controller';
import { TransactionTypeService } from './transactionType.service';

@Module({
  controllers: [TransactionTypeController],
  providers: [TransactionTypeService],
})
export class TransactionTypeModule {}
