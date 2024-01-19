import { Pagination } from 'src/modules/shared/domain/criteria/pagination';

import { PaginationLimitMother } from './pagination-limit.mother';
import { PaginationPageMother } from './pagination-page.mother';

export class PaginationMother {
  static create({
    page = PaginationPageMother.randomValue(),
    limit = PaginationLimitMother.randomValue(),
  }: {
    page?: number;
    limit?: number;
  }): Pagination {
    return Pagination.fromValues({ page, limit });
  }

  static random(): Pagination {
    return new Pagination(
      PaginationPageMother.random(),
      PaginationLimitMother.random(),
    );
  }
}
