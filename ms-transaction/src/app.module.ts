import { Module } from '@nestjs/common';

import { TransactionModule } from './transaction/transaction.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from '../db/data-source';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>(
      {
        autoSchemaFile: join(process.cwd(), 'src/graphql-schema.gql'),
        driver: ApolloDriver,
      }
    ),
    TypeOrmModule.forRoot(dataSourceOptions),
    TransactionModule
  ],
})
export class AppModule { }
