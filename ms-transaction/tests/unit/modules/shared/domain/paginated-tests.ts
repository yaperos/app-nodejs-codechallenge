import { PaginatedCollection } from 'src/modules/shared/domain/paginated-collection';

import { Tests } from '../domain/test-collection';

export class PaginatedTests extends PaginatedCollection<Tests> {
  public getTests(): Tests {
    return this.collection;
  }
}
