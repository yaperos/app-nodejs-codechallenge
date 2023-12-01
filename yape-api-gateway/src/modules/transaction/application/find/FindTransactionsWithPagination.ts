import { Inject, Injectable } from '@nestjs/common';

import { Transaction } from 'src/modules/transaction/domain/Transaction';
import { TransactionRepository } from 'src/modules/transaction/domain/TransactionRepository';
import { FindTransactionsInput } from './graphql/input/FindTransactionsInput';
import { IPageInfo } from 'src/Shared/adapters/interfaces/PageInfo';
import { InjectionToken } from '../../InjectionToken';

@Injectable()
export class FindTransactionsWithPagination {
  constructor(
    @Inject(InjectionToken.TRANSACTION_REPOSITORY)
    private readonly repository: TransactionRepository,
  ) {}

  async run(input: FindTransactionsInput): Promise<IPageInfo<Transaction>> {
    const { status, take, skip } = input;
    return await this.repository.findManyPaginated({
      params: {
        status,
      },
      pagination: {
        take,
        skip,
      },
    });
  }
}
