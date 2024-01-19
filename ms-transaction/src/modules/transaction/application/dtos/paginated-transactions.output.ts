import {
  IPaginatedBaseOutput,
  PaginatedBaseOutput,
} from 'src/modules/shared/application/dtos/paginated-base.output';
import { PaginatedTransactions } from 'src/modules/transaction/domain/paginated-transactions';
import { TransactionCriteria } from 'src/modules/transaction/domain/transaction-criteria';

import { TransactionOutput } from './transaction.output';

export interface IPaginatedTransactionsOutput extends IPaginatedBaseOutput {
  items: Array<TransactionOutput>;
}

export class PaginatedTransactionsOutput
  extends PaginatedBaseOutput
  implements IPaginatedTransactionsOutput
{
  readonly items: TransactionOutput[];

  constructor(
    paginatedTransactions: PaginatedTransactions,
    transactionCriteria: TransactionCriteria,
  ) {
    super(paginatedTransactions.getTotal(), transactionCriteria);

    this.items = paginatedTransactions
      .getTransactions()
      .all()
      .map(TransactionOutput.fromTransaction);
  }
}
