import {
  Args,
  Query,
  Resolver,
  Mutation,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { Transaction } from './entities/transaction.entity';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionType } from './entities/transactionType.entity';
import { TransactionStatus } from './entities/transactionStatus.entity';

@Resolver(() => Transaction)
export class TransactionResolver {
  constructor(private transactionService: TransactionService) {}

  @Query(() => [Transaction])
  async transactions() {
    return this.transactionService.findAll();
  }

  @Query(() => [TransactionType])
  transactionTypes() {
    return this.transactionService.getTransactionTypes();
  }

  @Query(() => [TransactionStatus])
  transactionStatuses() {
    return this.transactionService.getTransactionStatuses();
  }

  @Mutation(() => Transaction)
  createTransaction(
    @Args('transactionInput') transactionInput: CreateTransactionDto,
  ) {
    return this.transactionService.createTransactions(transactionInput);
  }

  @Query(() => Transaction)
  transaction(@Args('id') id: string) {
    return this.transactionService.findTransactionByUid(id);
  }

  @ResolveField(() => TransactionStatus)
  transactionStatus(@Parent() transaction: Transaction) {
    return this.transactionService.getTransactionStatusById(
      transaction.transactionStatus,
    );
  }

  @ResolveField(() => TransactionType)
  transactionType(
    @Parent() transaction: Transaction,
  ): Promise<TransactionType> {
    return this.transactionService.getTransactionTypeById(
      transaction.transactionType,
    );
  }
}
