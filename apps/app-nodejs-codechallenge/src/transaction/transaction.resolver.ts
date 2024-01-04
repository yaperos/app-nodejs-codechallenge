import {
  Resolver,
  Mutation,
  Args,
  Int,
  Query,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { TransactionsService } from './transaction.service';
import { TransactionType } from './entities/transaction-type.entity';
import { TransactionStatus } from './entities/transaction-status.entity';

@Resolver(() => Transaction)
export class TransactionsResolver {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Query(() => [Transaction], { name: 'transactions' })
  findAll() {
    return this.transactionsService.findAll();
  }

  @Query(() => Transaction, { name: 'transaction' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.transactionsService.findOne(id);
  }

  /**
   * Mutation
   * * createTransaction
   * * updateTransaction
   * * removeTransaction
   */

  @Mutation(() => Transaction)
  createTransaction(
    @Args('createTransactionInput')
    createTransactionInput: CreateTransactionInput,
  ) {
    return this.transactionsService.create(createTransactionInput);
  }

  @Mutation(() => Transaction)
  removeTransaction(@Args('id', { type: () => Int }) id: number) {
    return this.transactionsService.remove(id);
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
