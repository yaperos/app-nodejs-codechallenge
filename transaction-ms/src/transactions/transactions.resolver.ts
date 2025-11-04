import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { TransactionEntity } from './dto/entities/transaction.entity';
import { TransactionService } from './dto/transaction.service';
import { CreateTransactionInput } from './dto/input/create-transaction.input';
import { ParseUUIDPipe } from '@nestjs/common';

@Resolver(() => TransactionEntity)
export class TransactionsResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @Query(() => TransactionEntity, { name: 'transaction' })
  getTransaction(@Args('transactionExternalId', ParseUUIDPipe) transactionExternalId: string) {
    return this.transactionService.findOne(transactionExternalId);
  }

  @Mutation(() => TransactionEntity, { name: 'createTransaction' })
  createTransaction(
    @Args('createTransactionInput')
    createTransactionInput: CreateTransactionInput,
  ) {
    return this.transactionService.createTransaction(createTransactionInput);
  }
}
