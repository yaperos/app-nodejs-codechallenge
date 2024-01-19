import { Filter, FilterProps } from './filter';
import { Order } from './order';
import { Pagination } from './pagination';

export abstract class Criteria {
  private filters: Filter[] = [];
  private pagination: Pagination | null = null;
  private order: Order | null = null;

  public static createEmpty<T extends Criteria>(this: new () => T): T {
    return new this();
  }

  public setFiltersByValues(filters: FilterProps[]): this {
    this.filters = filters.map(Filter.fromValues);
    return this;
  }

  public setFilters(filters: Filter[]): this {
    this.filters = [...filters];
    return this;
  }

  public addFilter(filter: Filter): this {
    this.filters.push(filter);
    return this;
  }

  public getFilters(): Filter[] {
    return this.filters;
  }

  public ordering(order: Order): this {
    this.order = order;
    return this;
  }

  public getOrder(): Order | null {
    return this.order;
  }

  public paginateByDefault(page?: number, limit?: number): this {
    this.pagination = Pagination.fromDefault(page, limit);
    return this;
  }

  public paginate(pagination: Pagination): this {
    this.pagination = pagination;
    return this;
  }

  public getPagination(): Pagination | null {
    return this.pagination;
  }
}
