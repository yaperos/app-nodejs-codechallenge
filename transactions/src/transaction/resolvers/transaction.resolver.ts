import { CacheKey } from '@nestjs/cache-manager';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Transaction, TransactionInput } from '../graphql/types';
import { TransactionService } from '../services/transaction.service';

@Resolver('Transaction')
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @Query()
  @CacheKey('transaction')
  async transactionById(@Args('id') id: string): Promise<Transaction> {
    return this.transactionService.findOneById(id);
  }

  @Mutation()
  async createTransaction(
    @Args('transaction') transaction: TransactionInput,
  ): Promise<Transaction> {
    return this.transactionService.createTransaction(transaction);
  }
}
