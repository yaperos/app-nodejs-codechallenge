import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { TransactionsService } from '../services/transactions.service';
import { TransactionTaskEntity } from '../entities/transaction-task.entity';
import { CreateTransactionInput } from '../dto/create-transaction.input';
import { Transaction } from '../entities/transaction.entity';

@Resolver(() => Transaction)
export class TransactionsResolver {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Mutation(() => TransactionTaskEntity)
  async createTransaction(
    @Args('createTransactionInput')
    createTransactionInput: CreateTransactionInput,
  ): Promise<TransactionTaskEntity> {
    const transactionTask = await this.transactionsService.create(
      createTransactionInput,
    );

    return transactionTask;
  }

  @Query(() => TransactionTaskEntity, { name: 'transactionTask' })
  async findOneTask(@Args('id', { type: () => ID }) id: string) {
    return await this.transactionsService.findOneTask(id);
  }
}
