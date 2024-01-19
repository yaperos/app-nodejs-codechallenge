import { InvalidArgumentError } from 'src/modules/shared/domain/errors/invalid-argument.error';
import { PaginatedCollectionTotal } from 'src/modules/shared/domain/paginated-collection-total';

describe('PaginatedCollectionTotal test', () => {
  it('should throw an error for invalid value', () => {
    expect(() => {
      new PaginatedCollectionTotal(-1);
    }).toThrow(InvalidArgumentError);
  });
});
