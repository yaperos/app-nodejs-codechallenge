import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinancialTransactionEntity } from '../shared/infrastructure/financial-transaction.entity';
import { MongoFinancialTransactionsRepository } from '../shared/infrastructure/mongo-financial-transactions.repository';
import { CreateFinancialTransactionService } from './create-financial-transaction/application/create-financial-transaction.service';
import { CreateFinancialTransactionController } from './create-financial-transaction/infrastructure/create-financial-transaction.controller';
import { GetOneFinancialTransactionService } from './get-one-financial-transaction/application/get-one-financial-transaction.service';
import { GetOneFinancialTransactionController } from './get-one-financial-transaction/infrastructure/get-one-financial-transaction.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FinancialTransactionEntity])],
  controllers: [
    CreateFinancialTransactionController,
    GetOneFinancialTransactionController,
  ],
  providers: [
    CreateFinancialTransactionService,
    GetOneFinancialTransactionService,
    {
      provide: 'FinancialTransactionsRepository',
      useClass: MongoFinancialTransactionsRepository,
    },
  ],
})
export class FinancialTransactionsModule {}
