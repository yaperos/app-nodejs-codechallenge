import { Criteria } from 'src/modules/shared/domain/criteria/criteria';
import { FilterProps } from 'src/modules/shared/domain/criteria/filter';

export interface IPaginatedBaseOutput {
  page: number;
  limit: number;
  pages: number;
  total: number;
  filters: Array<FilterProps>;
}

export abstract class PaginatedBaseOutput implements IPaginatedBaseOutput {
  readonly page: number;
  readonly limit: number;
  readonly pages: number;
  readonly filters: Array<FilterProps>;

  protected constructor(readonly total: number, criteria: Criteria) {
    const pagination = criteria.getPagination();
    this.page = pagination.getPage();
    this.limit = pagination.getLimit();
    this.pages = pagination.getPages(this.total);
    this.filters = criteria.getFilters().map((filter) => filter.toValues());
  }
}
