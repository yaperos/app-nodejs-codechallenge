import { Args, Query, Resolver } from '@nestjs/graphql';

import { TransactionService } from '../services/transaction.service';

@Resolver('Transaction')
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @Query('transaction')
  async getTransaction(@Args('id') id: string) {
    return this.transactionService.findOneById(id);
  }
}
