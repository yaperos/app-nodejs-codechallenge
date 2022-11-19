import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TransactionService } from './transaction.service';
import { NewTransaction, TransactionDB, UpdateTransaction } from 'src/graphql';

@Resolver('Transaction')
export class TransactionResolvers {
  constructor(private readonly transactionService: TransactionService) {}

  @Query('transactions')
  async transactions() {
    return this.transactionService.transactions();
  }

  @Query('transaction')
  async transaction(@Args('id') args: string) {
    return this.transactionService.transaction(args);
  }

  @Mutation('createTransaction')
  async create(@Args('input') args: TransactionDB) {
    return this.transactionService.createTransaction(args);
  }

  @Mutation('updateTransaction')
  async update(@Args('input') args: UpdateTransaction) {
    return this.transactionService.updateTransaction(args);
  }

  @Mutation('deleteTransaction')
  async delete(@Args('id') args: string) {
    return this.transactionService.deleteTransaction(args);
  }

}