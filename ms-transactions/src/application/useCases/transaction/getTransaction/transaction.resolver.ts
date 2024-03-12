import { Resolver, Query, Args } from '@nestjs/graphql';
import {
  GetTransactionDto,
  TransactionFilterInput,
} from '../../../../domain/transaction/transaction.model';
import { TransactionService } from './transaction.service';

@Resolver()
export class GetTransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @Query(() => [GetTransactionDto])
  async getTransactions(@Args('filter') filter: TransactionFilterInput) {
    console.log(filter);

    const trasactions = await this.transactionService.getTransaction(filter);

    console.log(trasactions);

    return trasactions;
  }
}
