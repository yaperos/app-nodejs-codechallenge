import { HttpService } from '@nestjs/axios';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TransactionRequest, TransactionResponse } from './transaction.schema';

@Resolver()
export class TransactionResolver {
  constructor(private httpService: HttpService) {}

  @Query(() => TransactionResponse, {
    description: '',
  })
  async getTransaction(): Promise<TransactionResponse> {
    return {
      transactionExternalId: 'Guid',
      transactionType: {
        name: '',
      },
      transactionStatus: {
        name: '',
      },
      value: 120,
      createdAt: new Date(),
    };
  }

  @Mutation(() => TransactionResponse, {
    description: 'description',
  })
  async createTransaction(
    @Args() transactionRequest: TransactionRequest,
  ): Promise<TransactionResponse> {
    try {
      const { data: response } = await this.httpService.axiosRef.post<any>(
        `${process.env.TRANSACTION_SERVICE_URL}/transaction`,
        transactionRequest,
      );
      console.log(response);
    } catch (e) {
      throw new Error('test error');
    }

    return {
      transactionExternalId: 'Guid',
      transactionType: {
        name: '',
      },
      transactionStatus: {
        name: '',
      },
      value: 120,
      createdAt: new Date(),
    };
  }
}
