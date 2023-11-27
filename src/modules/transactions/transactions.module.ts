import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiErrorFilter } from 'src/common/api-errors/api-error-filter';
import { Transaction } from 'src/domain/entities/transaction.entity';
import { TransactionStatusModule } from '../transaction-status/transaction-status.module';
import { TransactionTypeModule } from '../transaction-type/transaction-type.module';
import { TransactionsResolver } from './graphql/transactions.resolver';
import { TransactionsService } from './services/transactions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    TransactionTypeModule,
    TransactionStatusModule,
  ],
  providers: [
    TransactionsResolver,
    TransactionsService,
    {
      provide: APP_FILTER,
      useClass: ApiErrorFilter,
    },
  ],
})
export class TransactionsModule {}
