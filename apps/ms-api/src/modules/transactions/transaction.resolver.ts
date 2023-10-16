/* eslint-disable prettier/prettier */
import { Args,Mutation,Query, Resolver } from '@nestjs/graphql';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { StatusRequest, StatusResponse, TransactionRequest, TransactionResponse } from './transaction.schema';
import { v4 as uuidv4 } from 'uuid';
import { CustomException } from 'shared/common';
@Resolver()
export class TransactionResolver {
  constructor(private httpService: HttpService) {
  }
  
  @Mutation(() => TransactionResponse, {
    description:
      'Create a transaction',
  })
  async createTransaction(
    @Args() args: TransactionRequest,
  ): Promise<TransactionResponse> {
    const requestId = uuidv4();
    try {
      const { data } =await lastValueFrom(
        this.httpService.post(
          `${process.env.TRANSACTION_SERVICE_URL}/ms-api/create`,
          {
            ...args,
            requestId,
          }
        ),
      );
      return {
        requestId: data
      };
    } catch (e) {
        console.log(e);
    }
  }

  @Query(() => StatusResponse)
  async transactionStatus(
    @Args() {requestId}: StatusRequest,
  ): Promise<StatusResponse> {
    try {
      const { data: status } =await lastValueFrom(
        this.httpService.get(
          `${process.env.TRANSACTION_SERVICE_URL}/ms-api/status/${requestId}`
        ),
      );
      return status;
    } catch (e) {
      throw new CustomException(e);
    }
      
  }
  
}
