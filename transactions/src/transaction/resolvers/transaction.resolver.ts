import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Transaction } from '../graphql/types';
import { TransactionService } from '../services/transaction.service';
import { TransactionInputDto } from '../contracts/transaction.create.dto';

@Resolver('Transaction')
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @Query()
  async transactionById(@Args('id') id: string): Promise<Transaction> {
    return this.transactionService.findOneById(id);
  }

  @Mutation()
  async createTransaction(
    @Args('transaction') transaction: TransactionInputDto,
  ): Promise<Transaction> {
    return this.transactionService.createTransaction(transaction);
  }
}
