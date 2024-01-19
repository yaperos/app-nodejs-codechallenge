import { Filter } from 'src/modules/shared/domain/criteria/filter';
import { FilterField } from 'src/modules/shared/domain/criteria/filter-field';
import {
  FilterOperator,
  Operator,
} from 'src/modules/shared/domain/criteria/filter-operator';
import { FilterValue } from 'src/modules/shared/domain/criteria/filter-value';
import { Order } from 'src/modules/shared/domain/criteria/order';
import { Pagination } from 'src/modules/shared/domain/criteria/pagination';
import { TypeOrmConverter } from 'src/modules/shared/infrastructure/persistence/typeorm/typeorm-converter';
import { SelectQueryBuilder } from 'typeorm';

import { TestCriteria } from '../../domain/criteria/test-criteria';
import { UuidMother } from '../../domain/mothers';

describe('TypeOrmConverter test', () => {
  const fieldMapper = new Map<string, string>([
    ['field1', 'e.field'],
    ['field2', 'f.field'],
    ['field3', 'g.field'],
    ['field4', 'h.field'],
  ]);
  const converter = new TypeOrmConverter(fieldMapper);

  it('should test convertField function', async () => {
    const queryBuilder: Partial<SelectQueryBuilder<any>> = {
      orderBy: jest.fn(),
    };

    const criteria = TestCriteria.createEmpty().ordering(Order.asc('field3'));
    converter.applyCriteria(criteria, queryBuilder as SelectQueryBuilder<any>);
    expect(queryBuilder.orderBy).toHaveBeenCalledWith(...['g.field', 'ASC']);

    criteria.ordering(Order.desc('field2'));
    converter.applyCriteria(criteria, queryBuilder as SelectQueryBuilder<any>);
    expect(queryBuilder.orderBy).toHaveBeenLastCalledWith(
      ...['f.field', 'DESC'],
    );

    criteria.ordering(Order.asc('field999'));
    converter.applyCriteria(criteria, queryBuilder as SelectQueryBuilder<any>);
    expect(queryBuilder.orderBy).toHaveBeenLastCalledWith(
      ...['e.field999', 'ASC'],
    );
  });

  it('should test applyOrdering function', async () => {
    const queryBuilder: Partial<SelectQueryBuilder<any>> = {
      orderBy: jest.fn(),
    };

    const criteria = TestCriteria.createEmpty();
    converter.applyCriteria(criteria, queryBuilder as SelectQueryBuilder<any>);
    expect(queryBuilder.orderBy).not.toHaveBeenCalled();

    criteria.ordering(Order.asc('field1'));
    converter.applyCriteria(criteria, queryBuilder as SelectQueryBuilder<any>);
    expect(queryBuilder.orderBy).toHaveBeenCalledWith(...['e.field', 'ASC']);

    criteria.ordering(Order.desc('field4'));
    converter.applyCriteria(criteria, queryBuilder as SelectQueryBuilder<any>);
    expect(queryBuilder.orderBy).toHaveBeenLastCalledWith(
      ...['h.field', 'DESC'],
    );
  });

  it('should test applyPagination function', async () => {
    const queryBuilder: Partial<SelectQueryBuilder<any>> = {
      skip: jest.fn(),
      take: jest.fn(),
    };

    const criteria = TestCriteria.createEmpty();
    converter.applyCriteria(criteria, queryBuilder as SelectQueryBuilder<any>);
    expect(queryBuilder.skip).not.toHaveBeenCalled();
    expect(queryBuilder.take).not.toHaveBeenCalled();

    const limit = 22;
    criteria.paginate(Pagination.fromValues({ page: 5, limit }));
    converter.applyCriteria(criteria, queryBuilder as SelectQueryBuilder<any>);
    expect(queryBuilder.skip).toHaveBeenCalledWith(88);
    expect(queryBuilder.take).toHaveBeenCalledWith(limit);
  });

  it('should test applyCriteriaFilters function with operators', async () => {
    const queryBuilder: Partial<SelectQueryBuilder<any>> = {
      andWhere: jest.fn(),
    };

    const equalFilter = Filter.fromValues({
      field: 'field1',
      operator: Operator.EQUAL,
      value: 'random1',
    });
    const notEqualFilter = Filter.fromValues({
      field: 'field2',
      operator: Operator.NOT_EQUAL,
      value: 'random2',
    });
    const gtFilter = Filter.fromValues({
      field: 'field3',
      operator: Operator.GT,
      value: 'random3',
    });
    const ltFilter = Filter.fromValues({
      field: 'field4',
      operator: Operator.LT,
      value: 'random4',
    });
    const containsFilter = Filter.fromValues({
      field: 'field3',
      operator: Operator.CONTAINS,
      value: 'random3',
    });
    const notContainsFilter = Filter.fromValues({
      field: 'field2',
      operator: Operator.NOT_CONTAINS,
      value: 'random2',
    });

    const criteria = TestCriteria.createEmpty().setFilters([
      equalFilter,
      notEqualFilter,
      gtFilter,
      ltFilter,
      containsFilter,
      notContainsFilter,
    ]);

    converter.applyCriteria(criteria, queryBuilder as SelectQueryBuilder<any>);
    expect(queryBuilder.andWhere).toHaveBeenCalledTimes(
      Object.keys(Operator).length,
    );
    expect(queryBuilder.andWhere).toHaveBeenCalledWith(
      ...['e.field = :value', { value: equalFilter.getValue() }],
    );
    expect(queryBuilder.andWhere).toHaveBeenCalledWith(
      ...['f.field != :value', { value: notEqualFilter.getValue() }],
    );
    expect(queryBuilder.andWhere).toHaveBeenCalledWith(
      ...['g.field > :value', { value: gtFilter.getValue() }],
    );
    expect(queryBuilder.andWhere).toHaveBeenCalledWith(
      ...['h.field < :value', { value: ltFilter.getValue() }],
    );
    expect(queryBuilder.andWhere).toHaveBeenCalledWith(
      ...['g.field LIKE :value', { value: containsFilter.getValue() }],
    );
    expect(queryBuilder.andWhere).toHaveBeenCalledWith(
      ...['f.field NOT LIKE :value', { value: notContainsFilter.getValue() }],
    );
  });

  it('should throw an error in applyFilter function', async () => {
    const queryBuilder: Partial<SelectQueryBuilder<any>> = {};

    const filter = new Filter(
      new FilterField('field'),
      {} as FilterOperator,
      new FilterValue('random'),
    );
    const criteria = TestCriteria.createEmpty().addFilter(filter);

    expect(() => {
      converter.applyCriteria(
        criteria,
        queryBuilder as SelectQueryBuilder<any>,
      );
    }).toThrow('Unexpected operator value undefined');
  });

  it('should test applyCriteriaFilters function with id or ids', async () => {
    const andWhereFn = jest.fn();
    const queryBuilder: Partial<SelectQueryBuilder<any>> = {
      andWhere: andWhereFn,
    };

    const id = UuidMother.random();
    const ids = [UuidMother.random(), UuidMother.random(), UuidMother.random()];

    let criteria = TestCriteria.createById(id);
    converter.applyCriteria(criteria, queryBuilder as SelectQueryBuilder<any>);
    expect(andWhereFn).toHaveBeenCalledTimes(1);
    expect(andWhereFn).toHaveBeenCalledWith(...['e.id = :id', { id }]);

    andWhereFn.mockClear();
    criteria = TestCriteria.createByIds(ids);
    converter.applyCriteria(criteria, queryBuilder as SelectQueryBuilder<any>);
    expect(andWhereFn).toHaveBeenCalledTimes(1);
    expect(andWhereFn).toHaveBeenCalledWith(...['e.id IN (:...ids)', { ids }]);
  });
});
