import { PaginatedCollection } from 'src/modules/shared/domain/paginated-collection';

import { Transactions } from './transactions';

export class PaginatedTransactions extends PaginatedCollection<Transactions> {
  public getTransactions(): Transactions {
    return this.collection;
  }
}
