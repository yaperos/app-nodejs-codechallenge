import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TransactionsService } from './transactions.service';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDTO } from './dtos/create-transaction.dto';

@Resolver((of) => Transaction)
export class TransactionsResolver {
  constructor(private transactionsService: TransactionsService) {}

  @Query((returns) => [Transaction])
  async transactions(): Promise<Transaction[]> {
    return this.transactionsService.findAll();
  }

  @Mutation((returns) => Transaction)
  async createTransaction(
    @Args('createTransactionInput')
    createTransactionInput: CreateTransactionDTO,
  ): Promise<Transaction> {
    return this.transactionsService.createTransaction(createTransactionInput);
  }
}
