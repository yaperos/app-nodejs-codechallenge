import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Transaction, TransactionStatus, TransactionType } from 'src/entities';
import { DataLoaderService } from 'src/services/dataloader/dataloader.service';
import { TransactionService } from 'src/services/transaction/transaction.service';
import { TransactionResolver } from 'src/resolvers/transaction.resolver';
import ConfigYapeProvider from 'src/providers/yape.provider';
import { makeCounterProvider } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, TransactionStatus, TransactionType]),
  ],
  providers: [
    ConfigYapeProvider,
    DataLoaderService,
    TransactionService,
    TransactionResolver,
    makeCounterProvider({
      name: 'transactions_saved',
      help: 'Transactions Saved',
    }),
    makeCounterProvider({
      name: 'transactions_updated',
      help: 'Transaction Updated',
    })
  ],
  exports: [DataLoaderService],
})
export class TransactionModule {}
