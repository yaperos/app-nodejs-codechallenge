import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TransactionModule } from './modules/transactions/transaction.module';
import { LoggerModule } from 'modules/logger/logger.module';

@Module({
  imports: [
    TransactionModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      installSubscriptionHandlers: true,
      path: `/graphql`,
      introspection: false,
    }),
    LoggerModule.forRoot('GQL Gateway Module'),
  ],
  providers: [],
  exports: [],
})
export class GqlGatewayModule {}
