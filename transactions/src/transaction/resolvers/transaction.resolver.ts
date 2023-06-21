import { Args, Query, Resolver } from '@nestjs/graphql';

import { Transaction } from '../graphql/types';
import { TransactionService } from '../services/transaction.service';

@Resolver('Transaction')
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @Query()
  async transactionById(@Args('id') id: string): Promise<Transaction> {
    return this.transactionService.findOneById(id);
  }
}
