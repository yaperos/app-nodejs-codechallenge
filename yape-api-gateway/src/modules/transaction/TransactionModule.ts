import { Module, Provider } from '@nestjs/common';
import { PrismaModule } from 'src/Shared/PrismaModule';
import { KafkaModule } from '../kafka/KafkaModule';

import { InjectionToken } from './InjectionToken';

import { CreateTransactionResolver } from './application/create/graphql/CreateTransactionResolver';
import { FindTransactionsWithPaginationResolver } from './application/find/graphql/FindTransactionsWithPaginationResolver';
import { FindTransactionResolver } from './application/find/graphql/FindTransactionResolver';

import { CreateTransaction } from './application/create/CreateTransaction';
import { UpdateTransactionToAprovedRejected } from './application/update/UpdateTransactionToAprovedRejected';
import { FindTransactionsWithPagination } from './application/find/FindTransactionsWithPagination';
import { FindTransaction } from './application/find/FindTransaction';

import { TransactionPrismaRepository } from './infrastructure/persistence/TransactionPrismaRepository';
import { CONSUMERS } from './domain/events/types';

const infrastructure: Provider[] = [
  {
    provide: InjectionToken.TRANSACTION_REPOSITORY,
    useClass: TransactionPrismaRepository,
  },
];

const application = [
  UpdateTransactionToAprovedRejected,
  CreateTransaction,
  CreateTransactionResolver,
  FindTransaction,
  FindTransactionResolver,
  FindTransactionsWithPagination,
  FindTransactionsWithPaginationResolver,
];

@Module({
  imports: [KafkaModule, PrismaModule],
  providers: [...infrastructure, ...application],
  exports: [...infrastructure, ...application],
})
export class TransactionModule {
  constructor(private createTransaction: CreateTransaction) {}

  async onModuleInit() {
    const requestPatterns = [CONSUMERS.TRANSACTION_WITH_FRAUD];
    await this.createTransaction.subscribeEvents(requestPatterns);
  }
}
