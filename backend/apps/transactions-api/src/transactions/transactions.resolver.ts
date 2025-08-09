import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CreateTransactionInput } from "apps/transactions-api/src/transactions/inputs/create-transaction.input";
import { Transaction } from "apps/transactions-api/src/transactions/models/transaction.model";
import { TransactionsService } from "apps/transactions-api/src/transactions/transactions.service";

@Resolver()
export class TransactionsResolver {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Mutation(() => Transaction, { name: 'createTransaction' })
  async create(@Args('input') input: CreateTransactionInput): Promise<Transaction> {
    return this.transactionsService.create(input);
  }
  
  @Query(() => Transaction)
  async transaction(@Args('externalId') externalId: string): Promise<Transaction> {
    return this.transactionsService.getByExternalId(externalId);
  }  
}