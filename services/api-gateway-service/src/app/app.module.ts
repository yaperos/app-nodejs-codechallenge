import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TransactionsModule } from 'src/modules/transactions/transactions.module';
import {
  constraintDirective,
  constraintDirectiveTypeDefs,
} from 'graphql-constraint-directive';

@Module({
  imports: [
    CommonModule,
    TransactionsModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      typeDefs: constraintDirectiveTypeDefs,
      transformSchema: constraintDirective(),
    }),
  ],
})
export class AppModule {}
