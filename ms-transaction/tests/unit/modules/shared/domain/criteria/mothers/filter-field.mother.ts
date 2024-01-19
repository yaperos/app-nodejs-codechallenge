import { FilterField } from 'src/modules/shared/domain/criteria/filter-field';
import { WordMother } from 'tests/unit/modules/shared/domain/mothers';

export class FilterFieldMother {
  static random(): FilterField {
    return new FilterField(this.randomValue());
  }

  static randomValue(): string {
    return WordMother.random();
  }
}
