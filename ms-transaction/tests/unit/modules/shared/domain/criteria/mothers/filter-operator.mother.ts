import {
  FilterOperator,
  Operator,
} from 'src/modules/shared/domain/criteria/filter-operator';

import { EnumMother } from '../../mothers';

export class FilterOperatorMother {
  static random(): FilterOperator {
    return new FilterOperator(this.randomValue());
  }

  static randomValue(): Operator {
    return EnumMother.random(Operator);
  }
}
