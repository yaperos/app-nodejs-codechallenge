import { TransactionCriteria } from 'src/modules/transaction/domain/transaction-criteria';

export class GetTransactionQuery {
  constructor(private readonly criteria: TransactionCriteria) {}

  public getCriteria(): TransactionCriteria {
    return this.criteria;
  }
}
