import { HttpStatus, Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TransactionsModule } from 'src/modules/transactions/transactions.module';
import { CustomGraphQLFormattedError } from 'src/common/models/http-exception-response.interface';

@Module({
  imports: [
    CommonModule,
    TransactionsModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      formatError: (error: CustomGraphQLFormattedError) => {
        const graphQLFormattedError = {
          message: error.message,
          code:
            error.extensions?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        };
        return graphQLFormattedError;
      },
    }),
  ],
})
export class AppModule {}
