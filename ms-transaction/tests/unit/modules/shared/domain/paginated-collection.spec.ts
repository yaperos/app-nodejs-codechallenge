import { IntegerMother, UuidMother } from './mothers';
import { PaginatedTests } from './paginated-tests';
import { Test } from './test';
import { Tests } from './test-collection';

describe('PaginatedCollection test', () => {
  it('should be correctly instance', () => {
    const testsCollection = new Tests([
      new Test(UuidMother.random()),
      new Test(UuidMother.random()),
    ]);
    const total = IntegerMother.random();

    const paginatedTests = new PaginatedTests(testsCollection, total);
    expect(paginatedTests.getTests()).toEqual(testsCollection);
    expect(paginatedTests.getTotal()).toEqual(total);
  });
});
