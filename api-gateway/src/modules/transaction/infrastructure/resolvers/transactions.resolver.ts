import { ParseUUIDPipe, UseFilters } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphQLExceptionFilter } from 'src/modules/shared/infrastructure/filters/graphql-exception.filter';

import { TransactionCreator } from '../../application/use-cases/transaction-creator.use-case';
import { TransactionFinder } from '../../application/use-cases/transaction-finder.use-case';
import { CreateTransactionInput } from '../dtos/input/create-transaction.input';
import { TransactionOutput } from '../dtos/output/transaction.output';

@UseFilters(new GraphQLExceptionFilter())
@Resolver(() => TransactionOutput)
export class TransactionsResolver {
  constructor(
    private readonly transactionCreator: TransactionCreator,
    private readonly transactionFinder: TransactionFinder,
  ) {}

  @Mutation(() => TransactionOutput, {
    description: 'Create a new transaction',
  })
  async createTransaction(
    @Args('createTransactionInput')
    createTransactionInput: CreateTransactionInput,
  ): Promise<TransactionOutput> {
    const transactionCreated = await this.transactionCreator.run(
      createTransactionInput,
    );
    return transactionCreated;
  }

  @Query(() => TransactionOutput, {
    name: 'transaction',
    description: 'Find a transaction by ID',
  })
  async findOne(
    @Args('transactionExternalId', { type: () => ID }, ParseUUIDPipe)
    transactionId: string,
  ): Promise<TransactionOutput> {
    const transaction = await this.transactionFinder.run(transactionId);
    return transaction;
  }
}
