import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { TransactionsService } from './transactions.service';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { TransactionType } from './entities/transaction-type.entity';
import { TransactionStatus } from './entities/transaction-status.entity';

@Resolver(() => Transaction)
export class TransactionsResolver {
  constructor(private readonly transactionsService: TransactionsService) { }

  @Mutation(() => Transaction)
  createTransaction(@Args('createTransactionInput') createTransactionInput: CreateTransactionInput) {
    return this.transactionsService.create(createTransactionInput);
  }

  @Query(() => [Transaction], { name: 'transactions' })
  findAll() {
    return this.transactionsService.findAll();
  }

  @Query(() => Transaction, { name: 'transaction' })
  findOne(@Args('transactionId', { type: () => String }) transactionId: string) {
    return this.transactionsService.findOne(transactionId);
  }

  @ResolveField(() => TransactionType)
  transactionType(@Parent() transaction: Transaction) {
    return this.transactionsService.getTransactionType(
      transaction.transactionTypeId,
    );
  }

  @ResolveField(() => TransactionStatus)
  transactionStatus(@Parent() transaction: Transaction) {
    return this.transactionsService.getTrasactionStatus(
      transaction.transactionStatusId,
    );
  }
}