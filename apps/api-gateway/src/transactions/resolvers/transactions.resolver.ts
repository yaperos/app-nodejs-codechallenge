import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { GetTransactionArg } from 'apps/api-gateway/src/transactions/dtos/args/transaction.arg';
import { CreateTransactionInput } from 'apps/api-gateway/src/transactions/dtos/inputs/create-transaction.input';
import { Transaction } from 'apps/api-gateway/src/transactions/dtos/models/transaction.model';
import { TransactionsService } from 'apps/api-gateway/src/transactions/services/transactions.service';

@Resolver()
export class TransactionsResolver {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Query(() => Transaction)
  async getTransaction(@Args() arg: GetTransactionArg): Promise<Transaction> {
    return this.transactionsService.getOne(arg);
  }

  @Mutation(() => Transaction)
  async createTransaction(
    @Args('input') input: CreateTransactionInput,
  ): Promise<Transaction> {
    return this.transactionsService.create(input);
  }
}
