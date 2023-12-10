import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TransactionsService } from './transactions.service';
import { DatabaseModule } from '@app/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsResolver } from './transactions.resolver';
import { TransactionRepository } from './repositories/transactions/transaction.repository';
import { TransactionTypeRepository } from './repositories/transaction-types/transaction-type.repository';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    DatabaseModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      typePaths: ['./**/*.graphql'],
    }),
    ClientsModule.register([
      {
        name: 'ANTIFRAUD_SERVICE',
        transport: Transport.KAFKA,
        options: {
          producerOnlyMode: true,
          client: {
            clientId: 'ms-antifraud',
            brokers: [process.env.KAFKA_BROKER],
          },
          consumer: {
            groupId: 'antifraud-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [TransactionsController],
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
