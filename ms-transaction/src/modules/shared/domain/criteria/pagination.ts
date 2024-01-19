import { PaginationLimit } from './pagination-limit';
import { PaginationPage } from './pagination-page';

export interface PaginationProps {
  page: number;
  limit: number;
}

export class Pagination {
  constructor(private page: PaginationPage, private limit: PaginationLimit) {}

  static fromValues({ page, limit }: PaginationProps): Pagination {
    return new Pagination(new PaginationPage(page), new PaginationLimit(limit));
  }

  static fromDefault(page?: number, limit?: number) {
    const paginationPage = PaginationPage.fromDefault(page);
    const paginationLimit = PaginationLimit.fromDefault(limit);
    return new Pagination(paginationPage, paginationLimit);
  }

  public getPage(): number {
    return this.page.value;
  }

  public getLimit(): number {
    return this.limit.value;
  }

  public getOffset(): number {
    return (this.page.value - 1) * this.limit.value;
  }

  public getPages(total: number): number {
    return Math.ceil(total / this.limit.value);
  }
}
