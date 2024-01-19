import { Inject } from '@nestjs/common';
import { PaginatedTransactions } from 'src/modules/transaction/domain/paginated-transactions';
import {
  TRANSACTION_REPOSITORY_ALIAS,
  TransactionRepository,
} from 'src/modules/transaction/domain/transaction.repository';
import { TransactionCriteria } from 'src/modules/transaction/domain/transaction-criteria';

export class TransactionsPaginator {
  constructor(
    @Inject(TRANSACTION_REPOSITORY_ALIAS)
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async run(criteria: TransactionCriteria): Promise<PaginatedTransactions> {
    const transactions = await this.transactionRepository.findTransactionsBy(
      criteria,
    );
    const total = await this.transactionRepository.countTransactions(criteria);

    return new PaginatedTransactions(transactions, total);
  }
}
