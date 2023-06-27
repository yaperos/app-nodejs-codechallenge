import { MessagePattern, Payload } from '@nestjs/microservices';
import { Transaction, TransactionStatus, TransactionType } from '../entities';

import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import { IDataloaders } from '../interfaces/data-loaders.interface';
import {
  CreateTransactionInput,
  GetTransactionArgs,
} from '../services/dto/index';
import { TransactionService } from '../services/transaction/transaction.service';
import { AntifraudValidationPayload } from '../interfaces/antifraud-validation-payload.interface';
import { TransactionStatusEnum } from '../enums/transaction-status.enum';

@Resolver(() => Transaction)
export class TransactionResolver {
  constructor(private transactionService: TransactionService) {}

  @ResolveField()
  async transactionType(
    @Parent() parent: Transaction,
    @Context() { loaders }: { loaders: IDataloaders },
  ): Promise<TransactionType> {
    return loaders.transactionTypeLoader.load(parent.transactionTypeId);
  }

  @Mutation(() => Transaction, { name: 'transaction' })
  async createTransaction(
    @Args('data') createTransactionData: CreateTransactionInput,
  ) {
    return this.transactionService.createTransaction(createTransactionData);
  }

  @MessagePattern('transaction.approved')
  async approveTransaction(@Payload() payload: AntifraudValidationPayload) {
    return this.transactionService.updateTransactionStatus(
      payload.transactionExternalId,
      TransactionStatusEnum.APPROVED,
    );
  }

  @MessagePattern('transaction.rejected')
  async rejectTransaction(@Payload() payload: AntifraudValidationPayload) {
    return this.transactionService.updateTransactionStatus(
      payload.transactionExternalId,
      TransactionStatusEnum.REJECTED,
    );
  }

  @Query(() => [Transaction], { name: 'transactions' })
  async getTransactions() {
    return this.transactionService.getTransactions();
  }

  @ResolveField()
  async transactionStatus(
    @Parent() parent: Transaction,
    @Context() { loaders }: { loaders: IDataloaders },
  ): Promise<TransactionStatus> {
    return loaders.transactionStatusLoader.load(parent.transactionStatusId);
  }

  @Query(() => Transaction, { name: 'transaction' })
  async getTransaction(@Args() args: GetTransactionArgs) {
    return this.transactionService.getTransaction(args.transactionExternalId);
  }
}
