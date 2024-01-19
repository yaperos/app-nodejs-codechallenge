import { PaginationLimit } from 'src/modules/shared/domain/criteria/pagination-limit';
import { IntegerMother } from 'tests/unit/modules/shared/domain/mothers';

export class PaginationLimitMother {
  static random(): PaginationLimit {
    return new PaginationLimit(this.randomValue());
  }

  static randomValue(): number {
    return IntegerMother.random({ min: PaginationLimit.MIN_VALUE });
  }
}
