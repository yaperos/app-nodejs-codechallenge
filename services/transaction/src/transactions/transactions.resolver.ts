import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from "@nestjs/graphql";
import { TransactionsService } from "./transactions.service";
import { Transaction } from "./entities/transaction.entity";
import { CreateTransactionInput } from "./dto/create-transaction.input";
import { TransactionType } from "./entities/transaction-type.entity";
import { TransactionStatus } from "./entities/transaction-status.entity";

@Resolver((of) => Transaction)
export class TransactionsResolver {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Query((returns) => [Transaction])
  transactions(): Promise<Transaction[]> {
    return this.transactionsService.findAll();
  }

  @ResolveField((returns) => TransactionType)
  transactionType(
    @Parent() transaction: Transaction
  ): Promise<TransactionType> {
    return this.transactionsService.findTransactionTypeById(
      transaction.transactionTypeId
    );
  }

  @ResolveField((returns) => TransactionStatus)
  transactionStatus(
    @Parent() transaction: Transaction
  ): Promise<TransactionStatus> {
    return this.transactionsService.findTransactionStatusById(
      transaction.transactionStatusId
    );
  }

  @Mutation((returns) => Transaction)
  createTransaction(
    @Args("createTransactionInput")
    createTransactionInput: CreateTransactionInput
  ) {
    return this.transactionsService.createTransaction(createTransactionInput);
  }
}
