import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Root,
  Context,
  Int,
  InputType,
  Field,
  registerEnumType,
} from '@nestjs/graphql'

import { TransactionResponseEntity as TransactionType } from './entities/transaction.response.entity';
import { TransactionService } from './transaction.service';
import { Inject } from '@nestjs/common';
import { CreateTransactionRequest } from './dto/create-transaction-request.dto';

Resolver(() => TransactionType)
export class TransactionResolver {

  constructor(
    @Inject(TransactionService) private transactionService: TransactionService
  ) { }

  @Query((returns) => TransactionType, { nullable: true })
  transaction(@Args('id', { type: () => String }) id: string) {
    return this.transactionService.findOne(id);
  }


  @Mutation((returns) => TransactionType)
  createTransaction(
    @Args('CreateTransactionRequest') createTransactionRequest: CreateTransactionRequest,
  ) {
    return this.transactionService.create(createTransactionRequest);
  }
}