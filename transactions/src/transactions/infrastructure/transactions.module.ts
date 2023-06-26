import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionCreator } from '@transactions/application/transaction.creator';
import { TransactionFinder } from '@transactions/application/transaction.finder';
import { Transaction } from '@transactions/domain/transaction.entity';
import { TransactionRepository } from '@transactions/infrastructure/transaction.repository';
import { TransactionsResolver } from '@transactions/infrastructure/transactions.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  providers: [
    TransactionRepository,
  ],
})
export class TransactionsModule {}
