import { FilterMother } from '../domain/criteria/mothers/filter.Mother';
import { PaginationMother } from '../domain/criteria/mothers/pagination.Mother';
import { TestCriteria } from '../domain/criteria/test-criteria';
import { IntegerMother } from '../domain/mothers';
import { PaginatedTests } from '../domain/paginated-tests';
import { Tests } from '../domain/test-collection';
import { PaginatedTestsOutput } from './paginated-tests.output';

describe('PaginatedBaseOutput test', () => {
  it('should be correctly instance without filters', () => {
    const testsCollection = new Tests([]);
    const total = IntegerMother.random({ min: 1 });
    const paginatedTests = new PaginatedTests(testsCollection, total);

    const pagination = PaginationMother.random();
    const criteria = TestCriteria.createEmpty().paginate(pagination);

    const paginatedTestsOutput = new PaginatedTestsOutput(
      paginatedTests,
      criteria,
    );
    expect(paginatedTestsOutput.page).toEqual(pagination.getPage());
    expect(paginatedTestsOutput.limit).toEqual(pagination.getLimit());
    expect(paginatedTestsOutput.pages).toEqual(pagination.getPages(total));
    expect(paginatedTestsOutput.filters).toEqual([]);
  });

  it('should be correctly instance with filters', () => {
    const paginatedTests = new PaginatedTests(
      new Tests([]),
      IntegerMother.random({ min: 1 }),
    );
    const criteria = TestCriteria.createEmpty().paginateByDefault();

    const filter = FilterMother.random();
    criteria.addFilter(filter);
    const paginatedTestsOutput = new PaginatedTestsOutput(
      paginatedTests,
      criteria,
    );
    expect(paginatedTestsOutput.filters).toEqual([filter.toValues()]);
  });
});
