import {
  Resolver,
  Mutation,
  Args,
  Query,
  ResolveField,
  Parent,
  Int,
} from '@nestjs/graphql';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { TransactionsService } from './transaction.service';
import { TransactionType } from './entities/transaction-type.entity';
import { TransactionStatus } from './entities/transaction-status.entity';

@Resolver(() => Transaction)
export class TransactionsResolver {
  constructor(private readonly transactionsService: TransactionsService) {}

  /**
   * Querys
   * transactions
   * transaction
   */

  @Query(() => [Transaction], { name: 'transactions' })
  findAll(
    @Args('orderBy', { type: () => String })
    orderBy: string,
    @Args('limit', { type: () => Int })
    limit: number,
  ) {
    return this.transactionsService.findAll(orderBy, limit);
  }

  @Query(() => Transaction, { name: 'transaction' })
  findOne(
    @Args('transactionExternalId', { type: () => String })
    transactionExternalId: string,
  ) {
    return this.transactionsService.findOne(transactionExternalId);
  }

  /**
   * Mutation
   * * createTransaction
   * * removeTransaction
   */

  @Mutation(() => Transaction)
  createTransaction(
    @Args('createTransactionInput')
    createTransactionInput: CreateTransactionInput,
  ) {
    return this.transactionsService.createTransaction(createTransactionInput);
  }

  @Mutation(() => Transaction)
  removeTransaction(
    @Args('transactionExternalId', { type: () => String })
    transactionExternalId: string,
  ) {
    return this.transactionsService.remove(transactionExternalId);
  }

  /**
   * Field resolution
   * * transactionType
   * * transactionStatus
   */

  @ResolveField(() => TransactionType)
  transactionType(@Parent() transaction: Transaction) {
    return this.transactionsService.getTransactionTypeService(
      transaction.transactionTypeId,
    );
  }

  @ResolveField(() => TransactionStatus)
  transactionStatus(@Parent() transaction: Transaction) {
    return this.transactionsService.getTrasactionStatusService(
      transaction.transactionStatusId,
    );
  }
}
