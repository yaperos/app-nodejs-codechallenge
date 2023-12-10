import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TransactionsService } from './transactions.service';
import { DatabaseModule } from '@app/common';
import { TransactionsResolver } from './transactions.resolver';
import { TransactionRepository } from './repositories/transactions/transaction.repository';
import { TransactionTypeRepository } from './repositories/transaction-types/transaction-type.repository';

@Module({
  imports: [
    DatabaseModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      typePaths: ['./**/*.graphql'],
    }),
  ],
  controllers: [],
  providers: [
    TransactionsService,
    TransactionsResolver,
    { provide: 'TRANSACTION_REPOSITORY', useClass: TransactionRepository },
    {
      provide: 'TRANSACTION_TYPE_REPOSITORY',
      useClass: TransactionTypeRepository,
    },
  ],
})
export class TransactionsModule {}
