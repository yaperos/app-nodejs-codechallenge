/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TransactionModule } from './modules/transactions/transaction.module';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import configuration from '../src/config/service.configuration';
@Module({
  imports:[
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(),'apps/ms-api/src/schema.gql'),
    }),
    TransactionModule
  ]  
})
export class AppModule {}
