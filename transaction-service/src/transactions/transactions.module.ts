import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsResolver } from './transactions.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RetrieveTransaction
  , TransactionStatus, TransactionType } from './post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    RetrieveTransaction,
    TransactionStatus,
    TransactionType
  ])],
  providers: [
    TransactionsService, 
    TransactionsResolver
  ]
})
export class TransactionsModule {}
