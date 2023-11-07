import { Logger, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TransactionModule } from './modules/transaction/transaction.module';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: (): ApolloDriverConfig => {
        return {
          autoSchemaFile: 'schema.gql',
          installSubscriptionHandlers: true,
          path: `gql`,
          introspection: false,
          formatError: (error: GraphQLError): GraphQLFormattedError => {
            Logger.error(error);
            return error;
          },
          context: ({ req }) => ({ req }),
        };
      },
    }),
    TransactionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
