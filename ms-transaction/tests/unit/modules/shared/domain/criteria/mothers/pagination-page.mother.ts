import { PaginationPage } from 'src/modules/shared/domain/criteria/pagination-page';
import { IntegerMother } from 'tests/unit/modules/shared/domain/mothers';

export class PaginationPageMother {
  static random(): PaginationPage {
    return new PaginationPage(this.randomValue());
  }

  static randomValue(): number {
    return IntegerMother.random({ min: PaginationPage.MIN_VALUE });
  }
}
