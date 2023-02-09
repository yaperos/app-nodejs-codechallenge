import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from '../database/entities';
import { IDataloaders } from '../interfaces/data-loaders.interface';
import { CreateTransactionInput, GetTransactionArgs } from './dto';
import { TransactionService } from './services/transaction.service';

@Resolver(() => Transaction)
export class TransactionResolver {
  constructor(private transactionService: TransactionService) {}

  @Query(() => Transaction, { name: 'transaction' })
  async getTransaction(@Args() args: GetTransactionArgs) {
    return this.transactionService.getTransaction(args.transactionExternalId);
  }

  @Query(() => [Transaction], { name: 'transactions' })
  async getTransactions() {
    return this.transactionService.getTransactions();
  }

  @Mutation(() => Transaction, { name: 'transaction' })
  async createTransaction(
    @Args('data') createTransactionData: CreateTransactionInput,
  ) {
    return this.transactionService.createTransaction(createTransactionData);
  }

  @ResolveField()
  async transactionStatus(
    @Parent() parent: Transaction,
    @Context() { loaders }: { loaders: IDataloaders },
  ): Promise<TransactionStatus> {
    return loaders.transactionStatusLoader.load(parent.transactionStatusId);
  }

  @ResolveField()
  async transactionType(
    @Parent() parent: Transaction,
    @Context() { loaders }: { loaders: IDataloaders },
  ): Promise<TransactionType> {
    return loaders.transactionTypeLoader.load(parent.transactionTypeId);
  }
}
