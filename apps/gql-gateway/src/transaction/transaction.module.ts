import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  TransactionResolver,
} from './transaction.resolver';
import {
  TRANSACTION_SERVICE
} from '../../../@shared';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      playground: true,
      debug: true,
    }),
    ClientsModule.register([
      {
        name: TRANSACTION_SERVICE,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'transaction-service',
            brokers: ['localhost:9091'],
          },
          consumer: {
            groupId: 'transaction-consumer',
          },
        },
      },
    ])
  ],
  providers: [
    TransactionResolver, 
    TransactionService,
  ], 
})
export class TransactionModule {};
