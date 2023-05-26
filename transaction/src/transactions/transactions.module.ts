import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsResolver } from './transactions.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { TransactionStatus } from './entities/transaction-status.entity';
import { TransactionType } from './entities/transaction-type.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionType, TransactionStatus, Transaction]),
  ],
  providers: [TransactionsResolver, TransactionsService],
})
export class TransactionsModule {}