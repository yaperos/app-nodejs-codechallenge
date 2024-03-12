import { Resolver, Query, Args } from '@nestjs/graphql';
import {
  GetTransactionInterface,
  TransactionFilterInput,
} from '../../../../domain/transaction/transaction.model';
import { TransactionService } from './transaction.service';

@Resolver()
export class GetTransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @Query(() => [GetTransactionInterface])
  async getTransactions(@Args('filter') filter: TransactionFilterInput) {
    const trasactions = await this.transactionService.getTransaction(filter);
    return trasactions;
  }
}
