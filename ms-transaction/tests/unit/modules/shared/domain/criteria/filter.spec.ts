import { Filter, FilterProps } from 'src/modules/shared/domain/criteria/filter';

import { FilterFieldMother } from './mothers/filter-field.Mother';
import { FilterOperatorMother } from './mothers/filter-operator.Mother';
import { FilterValueMother } from './mothers/filter-value.Mother';

describe('Filter test', () => {
  it('should instance from values', () => {
    const field = FilterFieldMother.randomValue();
    const operator = FilterOperatorMother.randomValue();
    const value = FilterValueMother.randomValue();

    const filter = Filter.fromValues({ field, operator, value });
    expect(filter.getField()).toEqual(field);
    expect(filter.getOperator()).toEqual(operator);
    expect(filter.getValue()).toEqual(value);
  });

  it('should test toValues function', () => {
    const filter: FilterProps = {
      field: FilterFieldMother.randomValue(),
      operator: FilterOperatorMother.randomValue(),
      value: FilterValueMother.randomValue(),
    };
    expect(Filter.fromValues(filter).toValues()).toEqual(filter);
  });
});
