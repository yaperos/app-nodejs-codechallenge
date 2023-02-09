import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { TransactionStatus } from 'src/database/entities/transaction-status.entity';
import { Transaction } from 'src/database/entities/transaction.entity';
import { IDataloaders } from 'src/interfaces/data-loaders.interface';
import CreateTransactionInput from './dto/create-transaction.input';
import GetTransactionArgs from './dto/get-transaction.args';
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
  ): Promise<TransactionStatus> {
    return loaders.transactionTypeLoader.load(parent.transactionTypeId);
  }
}
