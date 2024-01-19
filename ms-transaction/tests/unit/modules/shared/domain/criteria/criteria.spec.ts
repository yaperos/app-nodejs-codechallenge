import { FilterMother } from './mothers/filter.mother';
import { OrderMother } from './mothers/order.mother';
import { PaginationMother } from './mothers/pagination.mother';
import { TestCriteria } from './test-criteria';

describe('Criteria test', () => {
  it('should be instance empty', () => {
    const criteria = TestCriteria.createEmpty();
    expect(criteria.getFilters()).toEqual([]);
    expect(criteria.getOrder()).toBeNull();
    expect(criteria.getPagination()).toBeNull();
  });

  it('should be set filters', () => {
    const filter = FilterMother.random();
    const filters = [filter];

    let criteria = TestCriteria.createEmpty().setFilters(filters);
    expect(criteria.getFilters()).toEqual(filters);

    criteria = TestCriteria.createEmpty().setFilters([]).addFilter(filter);
    expect(criteria.getFilters()).toEqual(filters);

    criteria = TestCriteria.createEmpty().setFiltersByValues([
      filter.toValues(),
    ]);
    expect(criteria.getFilters()).toEqual(filters);
  });

  it('should be set order', () => {
    const order = OrderMother.random();

    const criteria = TestCriteria.createEmpty().ordering(order);
    expect(criteria.getOrder()).toEqual(order);
  });

  it('should be set pagination', () => {
    let pagination = PaginationMother.random();

    let criteria = TestCriteria.createEmpty().paginate(pagination);
    expect(criteria.getPagination()).toEqual(pagination);

    pagination = PaginationMother.random();
    criteria = TestCriteria.createEmpty().paginateByDefault(
      pagination.getPage(),
      pagination.getLimit(),
    );
    expect(criteria.getPagination()).toEqual(pagination);
  });
});
