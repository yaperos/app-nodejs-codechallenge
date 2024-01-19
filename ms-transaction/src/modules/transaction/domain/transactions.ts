import { Collection } from 'src/modules/shared/domain/collection';

import { Transaction } from './transaction';

export class Transactions extends Collection<Transaction> {
  constructor(private readonly transactions: Array<Transaction>) {
    super();
  }

  public all(): Array<Transaction> {
    return this.transactions;
  }
}
