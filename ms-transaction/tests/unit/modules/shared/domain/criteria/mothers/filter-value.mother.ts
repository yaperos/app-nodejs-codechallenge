import { FilterValue } from 'src/modules/shared/domain/criteria/filter-value';
import { StringMother } from 'tests/unit/modules/shared/domain/mothers';

export class FilterValueMother {
  static random(): FilterValue {
    return new FilterValue(this.randomValue());
  }
  static randomValue(): string {
    return StringMother.random();
  }
}
