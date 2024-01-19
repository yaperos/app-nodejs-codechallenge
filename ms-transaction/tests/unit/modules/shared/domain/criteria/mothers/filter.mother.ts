import { Filter } from 'src/modules/shared/domain/criteria/filter';

import { FilterFieldMother } from './filter-field.mother';
import { FilterOperatorMother } from './filter-operator.mother';
import { FilterValueMother } from './filter-value.mother';

export class FilterMother {
  static create({
    field = FilterFieldMother.randomValue(),
    operator = FilterOperatorMother.randomValue(),
    value = FilterValueMother.randomValue(),
  }: {
    field?: string;
    operator?: string;
    value?: string;
  }): Filter {
    return Filter.fromValues({ field, operator, value });
  }

  static random(): Filter {
    return new Filter(
      FilterFieldMother.random(),
      FilterOperatorMother.random(),
      FilterValueMother.random(),
    );
  }
}
