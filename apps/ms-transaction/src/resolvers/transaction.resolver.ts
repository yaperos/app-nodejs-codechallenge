import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Transaction, TransactionStatus, TransactionType } from '../models';
import {
  TransactionService,
  TransactionStatusService,
  TransactionTypeService,
} from '../services';
import { CreateTransactionDto } from '../dto';

@Resolver((of) => Transaction)
export class TransactionResolver {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly transactionStatusService: TransactionStatusService,
    private readonly transactionTypeService: TransactionTypeService,
  ) {}

  @Query((returns) => [Transaction])
  transactions(): Promise<Transaction[]> {
    return this.transactionService.findAll();
  }

  @Query(() => Transaction, { name: 'transactionFindOne' })
  findOne(@Args('id', { type: () => Int }) id: number): Promise<Transaction> {
    return this.transactionService.findOne(id);
  }

  @Mutation((returns) => Transaction)
  createTransaction(
    @Args('createTransactionInput')
    createTransactionInput: CreateTransactionDto,
  ): Promise<Transaction> {
    return this.transactionService.save(createTransactionInput);
  }

  @ResolveField(() => TransactionStatus)
  transactionStatus(
    @Parent() transaction: Transaction,
  ): Promise<TransactionStatus> {
    return this.transactionService.getTransactionsStatus(transaction.statusId);
  }

  @ResolveField(() => TransactionStatus)
  transactionType(
    @Parent() transaction: Transaction,
  ): Promise<TransactionType> {
    return this.transactionService.getTransactionsType(transaction.typeId);
  }
}
