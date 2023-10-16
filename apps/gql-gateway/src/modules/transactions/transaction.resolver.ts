import { HttpService } from '@nestjs/axios';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  SearchTransactionRequest,
  TransactionRequest,
  TransactionResponse,
} from './transaction.schema';
import { Logger } from 'modules/logger/logger.service';

@Resolver()
export class TransactionResolver {
  constructor(
    private httpService: HttpService,
    private readonly logger: Logger,
  ) {}

  @Query(() => TransactionResponse, {
    description: 'Fetch transaction by ID',
  })
  async getTransaction(
    @Args()
    { transactionExternalId }: SearchTransactionRequest,
  ): Promise<TransactionResponse> {
    try {
      this.logger.log(`Fetching transaction by externalId`);
      const { data: response } =
        await this.httpService.axiosRef.get<TransactionResponse>(
          `${process.env.TRANSACTION_SERVICE_URL}/transaction/${transactionExternalId}`,
        );
      this.logger.log('Transaction fetched');
      return response;
    } catch (e) {
      this.logger.error('Error fetching transaction', e.message);
      throw new Error(e);
    }
  }

  @Mutation(() => TransactionResponse, {
    description: 'Create new transaction.',
  })
  async createTransaction(
    @Args() transactionRequest: TransactionRequest,
  ): Promise<TransactionResponse> {
    try {
      this.logger.log(`Start create transaction`);
      const { data: response } =
        await this.httpService.axiosRef.post<TransactionResponse>(
          `${process.env.TRANSACTION_SERVICE_URL}/transaction`,
          transactionRequest,
        );
      this.logger.log(`End create transaction`);
      return response;
    } catch (e) {
      this.logger.error('Error in create transaction', e.message);
      throw new Error(e);
    }
  }
}
