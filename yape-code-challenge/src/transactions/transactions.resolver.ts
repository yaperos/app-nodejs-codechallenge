import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TransactionsService } from './transactions.service';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDTO } from './dtos/create-transaction.dto';

@Resolver((of) => Transaction)
export class TransactionsResolver {
  constructor(private transactionsService: TransactionsService) {}

  @Mutation((returns) => Transaction)
  async createTransaction(
    @Args('createTransactionInput')
    createTransactionInput: CreateTransactionDTO,
  ): Promise<Transaction> {
    return this.transactionsService.createTransaction(createTransactionInput);
  }

  @Query(() => Transaction)
  async transaction(
    @Args('transactionExternalId') transactionExternalId: string,
  ): Promise<Transaction> {
    return this.transactionsService.findOne(transactionExternalId);
  }
}
