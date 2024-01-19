import { Collection } from './collection';
import { PaginatedCollectionTotal } from './paginated-collection-total';

export abstract class PaginatedCollection<T extends Collection<any>> {
  protected readonly collection: T;
  protected readonly total: PaginatedCollectionTotal;

  public constructor(collection: T, total: number) {
    this.collection = collection;
    this.total = new PaginatedCollectionTotal(total);
  }

  public getTotal(): number {
    return this.total.value;
  }
}
