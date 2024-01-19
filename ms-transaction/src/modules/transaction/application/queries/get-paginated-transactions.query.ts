import { TransactionCriteria } from 'src/modules/transaction/domain/transaction-criteria';

export class GetPaginatedTransactionsQuery {
  constructor(private readonly transactionCriteria: TransactionCriteria) {}

  public getTransactionCriteria(): TransactionCriteria {
    return this.transactionCriteria;
  }
}
