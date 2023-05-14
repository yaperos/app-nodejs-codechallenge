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
import { CreateTransactionInput } from './dto/create-transaction.input';
import { TransactionType } from './entities/transactionType.entity';
import { TransactionStatus } from './entities/transactionStatus.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Resolver(() => Transaction)
export class TransactionResolver {
  constructor(private transactionService: TransactionService) {}

  @Query(() => [Transaction])
  @UseGuards(JwtAuthGuard)
  async transactions() {
    return this.transactionService.findAll();
  }

  @Query(() => [TransactionType])
  @UseGuards(JwtAuthGuard)
  transactionTypes() {
    return this.transactionService.getTransactionTypes();
  }

  @Query(() => [TransactionStatus])
  @UseGuards(JwtAuthGuard)
  transactionStatuses() {
    return this.transactionService.getTransactionStatuses();
  }

  @Mutation(() => Transaction)
  @UseGuards(JwtAuthGuard)
  createTransaction(
    @Args('transactionInput') transactionInput: CreateTransactionInput,
  ) {
    transactionInput.transactionStatusId = 1;
    transactionInput.transactionTypeId = transactionInput['transferTypeId'];
    return this.transactionService.createTransactions(transactionInput);
  }

  @Query(() => Transaction)
  @UseGuards(JwtAuthGuard)
  transaction(@Args('externalId') id: string) {
    return this.transactionService.findTransactionByExternalUid(id);
  }

  @ResolveField(() => TransactionStatus)
  transactionStatus(@Parent() transaction: Transaction) {
    return this.transactionService.getTransactionStatusById(
      transaction.transactionStatusId,
    );
  }

  @ResolveField(() => TransactionType)
  transactionType(
    @Parent() transaction: Transaction,
  ): Promise<TransactionType> {
    return this.transactionService.getTransactionTypeById(
      transaction.transactionTypeId,
    );
  }
}
