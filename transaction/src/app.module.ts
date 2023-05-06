import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { TransactionModule } from './transaction/transaction.module';
import { TransactionTypeModule } from './transaction-type/transaction-type.module';
import { TransactionStatusModule } from './transaction-status/transaction-status.module';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { TransactionValidationModule } from './transaction-validation/transaction-validation.module';
import { dataSoruceOptions } from './db/data-source';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/gql/schema.gql'),
      formatError: (error: GraphQLError) => {
        const graphQLFormattedError: GraphQLFormattedError = {
          message:
            (error?.extensions?.originalError as string) || error.message,
        };
        return graphQLFormattedError;
      },
    }),
    TypeOrmModule.forRoot(dataSoruceOptions),
    TransactionModule,
    TransactionTypeModule,
    TransactionStatusModule,
    TransactionValidationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule {}
