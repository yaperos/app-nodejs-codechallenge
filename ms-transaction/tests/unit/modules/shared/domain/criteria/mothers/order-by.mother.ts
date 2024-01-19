import { OrderBy } from 'src/modules/shared/domain/criteria/order-by';
import { WordMother } from 'tests/unit/modules/shared/domain/mothers';

export class OrderByMother {
  static random(): OrderBy {
    return new OrderBy(this.randomValue());
  }

  static randomValue(): string {
    return WordMother.random().replace(/\W/, '');
  }
}
