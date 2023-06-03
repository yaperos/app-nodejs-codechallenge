import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AppService } from './app.service';
import {
  CreateTransactionInput,
  CreateTransactionObject,
  TransactionObject,
} from './transaction.dto';

@Resolver()
export class TransactionResolver {
  constructor(private readonly appService: AppService) {}

  /*
    Query to get transaction data by transactionExternalId
  */
  @Query(() => TransactionObject)
  async transaction(
    @Args('transactionExternalId') transactionExternalId: string,
  ): Promise<TransactionObject> {
    return await this.appService.findTransactionByExternalId(
      transactionExternalId,
    );
  }

  /*
    Mutation to create a new transaction
  */
  @Mutation(() => CreateTransactionObject)
  addTransaction(
    @Args('transactionData') transactionData: CreateTransactionInput,
  ): CreateTransactionObject {
    return this.appService.createTransaction(transactionData);
  }
}
