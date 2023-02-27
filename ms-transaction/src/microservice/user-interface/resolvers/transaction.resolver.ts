import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TransactionModel } from '../../application-core/transaction/models';
import { TransactionService } from '../../application-core/transaction/services';
import { CreateTransactionInput } from '../../application-core/transaction/dtos/inputs/index';
import { TransactionStatusEnum } from '../../application-core/transaction/dtos/enums/index';

@Resolver('Transaction')
export class TransactionResolver {
  constructor(private transactionService: TransactionService) {}

  @Query(() => TransactionModel)
  async getTransaction(
    @Args('transactionExternalId') id: string,
  ): Promise<TransactionModel> {
    const transaction = await this.transactionService.getTransactionById(id);
    return transaction;
  }

  @Mutation(() => TransactionModel)
  async createTransaction(
    @Args('createTransactionInput')
    createTransactionInput: CreateTransactionInput,
  ): Promise<TransactionModel> {
    const newTransaction = await this.transactionService.createTransaction(
      createTransactionInput,
    );
    return newTransaction;
  }

  @Mutation(() => Boolean)
  async updateTransactionStatus(
    @Args('transactionExternalId') id: string,
    @Args('transactionStatus') status: TransactionStatusEnum,
  ): Promise<boolean> {
    const updated = await this.transactionService.updateStatus(id, status);
    return updated;
  }
}
