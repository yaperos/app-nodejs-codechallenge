import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { Transaction } from './transaction.entity';
import { TransactionService } from './transaction.service';
import { CreateTransactionArgs as LocalCreateTransactionArgs } from './create-transaction.args';

@Resolver(() => Transaction)
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @Mutation(() => Transaction)
  async createTransaction(@Args('transactionData') transactionData: LocalCreateTransactionArgs): Promise<Transaction> {
    return this.transactionService.createTransaction(transactionData);
  }

  @Query(() => Transaction, { nullable: true })
  async getTransaction(@Args('transactionExternalId') transactionExternalId: string): Promise<Transaction | undefined> {
    return this.transactionService.getTransaction(transactionExternalId);
  }

  @Query(() => [Transaction])
  async getAllTransactions(): Promise<Transaction[]> {
    return this.transactionService.getAllTransactions();
  }
}