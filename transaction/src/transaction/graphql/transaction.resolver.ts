import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TransactionService } from '../transaction.service';
import { TransactionTypeGraphql } from './tipos/transaction.type.graphql';
import { CreateTransactionWithGraphql } from '../dto/create-transaction-graphql';
import { UsePipes, ValidationPipe } from '@nestjs/common';

@Resolver(() => TransactionTypeGraphql)
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @Query(() => TransactionTypeGraphql, { nullable: true })
  async findTransactionByExternalId(
    @Args('transactionExternalId') transactionExternalId: string,
  ): Promise<TransactionTypeGraphql> {
    return this.transactionService.findOneByTransactionExternalIdWithGraphql(transactionExternalId);
  }

  @Mutation(() => TransactionTypeGraphql)
  @UsePipes(new ValidationPipe())
  async createTransaction(
    @Args('CreateTransactionWithGraphql') createTransaction: CreateTransactionWithGraphql,
  ): Promise<TransactionTypeGraphql> {
    
    return this.transactionService.createWithGraphql(createTransaction);
  }
}
