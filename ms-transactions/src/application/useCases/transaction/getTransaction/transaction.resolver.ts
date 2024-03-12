import { Resolver, Query, Args } from '@nestjs/graphql';
import {
  GetTransactionInterface,
  TransactionFilterInput,
} from '../../../../domain/transaction/createTransaction/transaction.model';
import { TransactionService } from './transaction.service';
import { TransactionResolverInterface } from 'src/domain/transaction/getTransaction/transaction.interface';

@Resolver()
export class GetTransactionResolver implements TransactionResolverInterface {
  constructor(private readonly transactionService: TransactionService) {}

  @Query(() => [GetTransactionInterface])
  async getTransactions(@Args('filter') filter: TransactionFilterInput) {
    const trasactions = await this.transactionService.getTransaction(filter);
    return trasactions;
  }
}
