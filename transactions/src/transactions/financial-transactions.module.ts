import { Module } from '@nestjs/common';
import { FinancialTransactionsController } from '@/transactions/financial-transactions.controller';
import { FinancialTransactionsService } from '@/transactions/financial-transactions.service';

@Module({
  controllers: [FinancialTransactionsController],
  providers: [FinancialTransactionsService],
})
export class FinancialTransactionModule {}
