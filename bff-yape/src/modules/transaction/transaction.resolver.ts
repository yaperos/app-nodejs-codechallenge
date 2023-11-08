import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import {
  GetTransactionArgs,
  TransactionCreate,
  TransactionStatusResolver,
} from './transaction.schema';
import { TransactionType } from 'src/constants/transaction.const';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { transformTransaction } from 'src/utils/transform';

@Resolver(() => TransactionStatusResolver)
export class TransactionResolver {
  constructor(private httpService: HttpService) {}

  @Query(() => TransactionStatusResolver)
  async getTransaction(
    @Args('getTransactionArgs')
    { transactionExternalId }: GetTransactionArgs,
  ) {
    const { data: response } = await lastValueFrom(
      this.httpService.get(
        `${process.env.MSA_TRANSACTION}/transaction/${transactionExternalId}`,
        {},
      ),
    );
    return transformTransaction(response);
  }

  @Mutation(() => TransactionStatusResolver)
  async createTransaction(
    @Args('transactionCreate') transactionCreate: TransactionCreate,
  ) {
    const { data: response } = await lastValueFrom(
      this.httpService.post(
        `${process.env.MSA_TRANSACTION}/transaction`,
        transactionCreate,
      ),
    );
    return transformTransaction(response);
  }
}
