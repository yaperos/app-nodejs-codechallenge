import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TransactionService } from './services/transaction.service';
import { Transaction } from './entities/transaction.entity';
import {
  CreateTransactionInput,
  TransactionTypeInput,
  TrasactionStatusInput,
} from './dto/create-transaction.input';
import { TransactionStatus } from './entities/transactionStatus.entity';
import { TransactionType } from './entities/transactionType.entity';
import { TransactionTypeervice } from './services/transactionType.service';
import { TransactionStatusService } from './services/transactionStatus.service';

@Resolver(() => Transaction)
export class TransactionsResolver {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly transactionTypeService: TransactionTypeervice,
    private readonly transactionStatusService: TransactionStatusService,
  ) {}

  // Transaction
  @Mutation(() => Transaction)
  async createTransaction(
    @Args('createTransactionInput')
    createTransactionInput: CreateTransactionInput,
  ) {
    return await this.transactionService.create(createTransactionInput);
  }

  @Query(() => [Transaction], { name: 'transactions' })
  findAll() {
    return this.transactionService.findAll();
  }

  @Query(() => Transaction, { name: 'transaction' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.transactionService.findOne(id);
  }

  @Query(() => [TransactionStatus], { name: 'status' })
  findAllStatus() {
    return this.transactionStatusService.findAll();
  }

  @Query(() => [TransactionType], { name: 'types' })
  findAllType() {
    return this.transactionTypeService.findAll();
  }

  @Mutation(() => TransactionStatus)
  async createTransactionStatus(
    @Args('createStatus') createTransactionStatus: TrasactionStatusInput,
  ) {
    return await this.transactionStatusService.create(createTransactionStatus);
  }

  @Mutation(() => TransactionType)
  async createTransactionType(
    @Args('createStatus') createTransactionType: TransactionTypeInput,
  ) {
    return await this.transactionTypeService.create(createTransactionType);
  }
}
