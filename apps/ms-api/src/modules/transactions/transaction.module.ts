/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TransactionResolver } from './transaction.resolver';
import { APP_FILTER } from '@nestjs/core';
import { GqlExceptionFilter } from '../../filters/gql-exception.filter';

@Module({
  imports: [HttpModule],
  providers: [TransactionResolver,{
    provide: APP_FILTER,
    useClass: GqlExceptionFilter,
  },],
})
export class TransactionModule {}