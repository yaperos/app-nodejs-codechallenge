import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { graphqlUploadExpress } from 'graphql-upload';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TransactionModule } from './modules/transactions/transaction.module';

@Module({
  imports: [
    TransactionModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      installSubscriptionHandlers: true,
      path: `${process.env.GQL_BASE_PATH}/graphql`,
      introspection: false,
    }),
  ],
  providers: [],
  exports: [],
})
export class GqlGatewayModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(graphqlUploadExpress())
      .forRoutes(`${process.env.GQL_BASE_PATH}/graphql`);
  }
}
