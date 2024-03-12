import { Resolver, Query, Args } from '@nestjs/graphql';
import {
  GetTransactionInterface,
  TransactionFilterInput,
} from '../../../../domain/transaction/createTransaction/transaction.model';
import { TransactionService } from './transaction.service';
import { TransactionResolverInterface } from 'src/domain/transaction/getTransaction/transaction.interface';
import { LoggerService } from '../../logger/logger.service';
import { randomUUID } from 'crypto';

@Resolver()
export class GetTransactionResolver implements TransactionResolverInterface {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly loggerService: LoggerService,
  ) {}

  @Query(() => [GetTransactionInterface])
  async getTransactions(@Args('filter') filter: TransactionFilterInput) {
    const trx = randomUUID();
    try {
      this.loggerService.report(
        'log',
        { filter, mission: 'getting-transactions' },
        trx,
      );
      const trasactions = await this.transactionService.getTransaction(filter);
      this.loggerService.report(
        'log',
        { trasactions, mission: 'get-transactions' },
        trx,
      );
      return trasactions;
    } catch (error) {
      this.loggerService.report(
        'error',
        { filter, error, mission: 'error-getting-transaction' },
        trx,
      );
    }
  }
}
