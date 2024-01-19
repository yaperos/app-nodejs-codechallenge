import { PaginatedBaseOutput } from 'src/modules/shared/application/dtos/paginated-base.output';

import { TestCriteria } from '../domain/criteria/test-criteria';
import { PaginatedTests } from '../domain/paginated-tests';

export class PaginatedTestsOutput extends PaginatedBaseOutput {
  constructor(
    paginatedProducts: PaginatedTests,
    productCriteria: TestCriteria,
  ) {
    super(paginatedProducts.getTotal(), productCriteria);
  }
}
