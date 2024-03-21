import { Module } from '@nestjs/common';
import { TransactionsService } from './services/transactions.service';
import { TransactionsResolver } from './resolvers/transactions.resolver';
import { DatabaseModule } from '../database/database.module';
import { Transaction, TransactionStatus, TransactionType, } from '../models';
import { TransactionsController } from './controllers/transactions.controller';

@Module({
  imports: [DatabaseModule.forFeature([Transaction, TransactionType, TransactionStatus])],
  providers: [TransactionsService, TransactionsResolver],
  controllers: [TransactionsController]
})
export class TransactionsModule {}
