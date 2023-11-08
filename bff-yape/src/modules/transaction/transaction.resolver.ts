import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import {
  GetTransactionArgs,
  TransactionCreate,
  TransactionStatusResolver,
} from './transaction.schema';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { transformTransaction } from '../../utils/transform.utils';

@Resolver(() => TransactionStatusResolver)
export class TransactionResolver {
  constructor(private httpService: HttpService) {}
  @Query(() => TransactionStatusResolver, { nullable: true })
  async getTransaction(
    @Args('getTransactionArgs')
    { transactionExternalId }: GetTransactionArgs,
  ) {
    const { data: response } = await lastValueFrom(
      this.httpService.get(
        `${process.env.MSA_TRANSACTION}/transactions/${transactionExternalId}`,
      ),
    );
    return transformTransaction(response);
  }
  @Mutation(() => TransactionStatusResolver, { nullable: true })
  async createTransaction(
    @Args('transactionCreate') transactionCreate: TransactionCreate,
  ) {
    const { data: response } = await lastValueFrom(
      this.httpService.post(
        `${process.env.MSA_TRANSACTION}/transactions`,
        transactionCreate,
      ),
    );
    return transformTransaction(response);
  }
}
