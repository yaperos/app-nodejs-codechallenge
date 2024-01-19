import { Filter } from 'src/modules/shared/domain/criteria/filter';

import { FilterFieldMother } from './filter-field.Mother';
import { FilterOperatorMother } from './filter-operator.Mother';
import { FilterValueMother } from './filter-value.Mother';

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
