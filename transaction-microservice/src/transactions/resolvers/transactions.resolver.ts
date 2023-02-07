import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TransactionsService } from '../services/transactions.service';
import { CreateTransactionInput } from '../dto/create-transaction.input';
import { Transaction } from '../entities/transaction.entity';

@Resolver()
export class TransactionsResolver {
  constructor(private transactionService: TransactionsService) {}

  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }

  @Mutation((returns) => Transaction)
  createTransaction(
    @Args('transactionInput')
    transactionInput: CreateTransactionInput,
  ) {
    return this.transactionService.creategraphql(transactionInput);
  }
}
