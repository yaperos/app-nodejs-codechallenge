import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import {
  GetTransactionArgs,
  TransactionCreate,
  TransactionStatusResolver,
} from './transaction.type';
import { TransactionType } from 'src/constants/transaction.const';

@Resolver(() => TransactionStatusResolver)
export class TransactionResolver {
  @Query(() => TransactionStatusResolver)
  getTransaction(
    @Args('getTransactionArgs')
    { transactionExternalId }: GetTransactionArgs,
  ) {
    return {
      transactionExternalId,
      transactionType: { name: 'transactionType' },
      transactionStatus: { name: 'transactionStatus' },
      value: 100,
      createdAt: new Date(),
    };
  }

  @Mutation(() => TransactionStatusResolver)
  createTransaction(
    @Args('transactionCreate') transactionCreate: TransactionCreate,
  ) {
    return {
      transactionExternalId: 'test',
      transactionType: {
        name: TransactionType[transactionCreate.tranferTypeId],
      },
      transactionStatus: { name: 'asdsad' },
      value: transactionCreate.value,
      createdAt: new Date(),
    };
  }
}
