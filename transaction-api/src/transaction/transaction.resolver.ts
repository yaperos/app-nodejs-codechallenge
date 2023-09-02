import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TransactionService } from './transaction.service';
import { Transaction } from './transaction.entity';
import { createTransactionInput } from './dto/create-transaction.input';

@Resolver()
export class TransactionResolver {
  constructor(private transactionService: TransactionService) {}

  @Query(() => [Transaction])
  transactions() {
    return this.transactionService.getTransactions();
  }

  @Query(() => Transaction)
  transaction(@Args('id') id: string) {
    return this.transactionService.findTransactionById(id);
  }

  @Mutation(() => Transaction)
  createTransaction(
    @Args('transactionInput') transactionInput: createTransactionInput,
  ) {
    return this.transactionService.createTransaction(transactionInput);
  }

  @Mutation(() => Transaction)
  deleteTransaction(@Args('id') id: string) {
    return this.transactionService.deleteTransaction(id);
  }
}
