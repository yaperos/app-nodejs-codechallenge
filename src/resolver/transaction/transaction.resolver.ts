import { InterceptorIdentifierService } from '@core/interceptor';
import { UseInterceptors } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TransactionRequest } from '@transaction/model/request/transaction-request';
import { TransactionResponseData } from '@transaction/model/response/transaction-data.response';
import { TransactionResponse } from '@transaction/model/response/transaction.response';
import { TransactionService } from '@transaction/service/transaction.service';


@Resolver()
export class TransactionResolve {
  constructor(private transactionService: TransactionService) { }

  @UseInterceptors(InterceptorIdentifierService)
  @Mutation(() => [TransactionResponseData], { name: 'registers', description: 'se enviara los events' })
  async transaction(@Args('transactionRequest') transactionRequest: TransactionRequest) {
    return this.transactionService.create(transactionRequest);
  }

  @UseInterceptors(InterceptorIdentifierService)
  @Query(() => [TransactionResponse])
  async getTransactions() {
    return this.transactionService.get();
  }

  @UseInterceptors(InterceptorIdentifierService)
  @Query(() => TransactionResponse)
  async getTransactionsById(@Args('id') id: string) {
    return this.transactionService.getById(id);
  }

}
