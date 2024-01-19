import { Criteria } from 'src/modules/shared/domain/criteria/criteria';
import { CriteriaWithId } from 'src/modules/shared/domain/criteria/criteria-with-id';
import { Filter } from 'src/modules/shared/domain/criteria/filter';
import { Operator } from 'src/modules/shared/domain/criteria/filter-operator';
import { Order } from 'src/modules/shared/domain/criteria/order';
import { Pagination } from 'src/modules/shared/domain/criteria/pagination';
import { SelectQueryBuilder } from 'typeorm';

interface FilterApplyFunction<Filter, Q> {
  (filter: Filter, query: Q): void;
}

export class TypeOrmConverter {
  private readonly operationMapper: Map<
    Operator,
    FilterApplyFunction<Filter, SelectQueryBuilder<any>>
  >;

  constructor(private readonly fieldMapper: Map<string, string>) {
    this.operationMapper = new Map<
      Operator,
      FilterApplyFunction<Filter, SelectQueryBuilder<any>>
    >([
      [Operator.EQUAL, this.applyComparationFilter],
      [Operator.NOT_EQUAL, this.applyComparationFilter],
      [Operator.GT, this.applyComparationFilter],
      [Operator.LT, this.applyComparationFilter],
      [Operator.CONTAINS, this.applyLikeFilter],
      [Operator.NOT_CONTAINS, this.applyLikeFilter],
    ]);
  }

  private convertField(field: string): string {
    const convertedField = this.fieldMapper.get(field);
    return convertedField ?? `e.${field}`;
  }

  public applyCriteria<E>(
    criteria: Criteria,
    queryBuilder: SelectQueryBuilder<E>,
  ) {
    this.applyCriteriaFilters(criteria, queryBuilder);

    if (criteria.getOrder()) {
      this.applyOrdering(criteria.getOrder(), queryBuilder);
    }

    if (criteria.getPagination()) {
      this.applyPagination(criteria.getPagination(), queryBuilder);
    }
  }

  private applyOrdering<E>(order: Order, queryBuilder: SelectQueryBuilder<E>) {
    queryBuilder.orderBy(
      this.convertField(order.getOrderBy()),
      order.isAsc() ? 'ASC' : 'DESC',
    );
  }

  private applyPagination<E>(
    pagination: Pagination,
    queryBuilder: SelectQueryBuilder<E>,
  ) {
    queryBuilder.skip(pagination.getOffset());
    queryBuilder.take(pagination.getLimit());
  }

  private applyCriteriaFilters<E>(
    criteria: Criteria,
    queryBuilder: SelectQueryBuilder<E>,
  ) {
    const filters = criteria.getFilters();
    filters.forEach((filter) => {
      this.applyFilter(filter, queryBuilder);
    });

    if (criteria instanceof CriteriaWithId) {
      const id = criteria.getId();
      if (id) {
        queryBuilder.andWhere('e.id = :id', { id });
      }

      const ids = criteria.getIds();
      if (ids && ids.length) {
        queryBuilder.andWhere('e.id IN (:...ids)', { ids });
      }
    }
  }

  private applyFilter<E>(filter: Filter, queryBuilder: SelectQueryBuilder<E>) {
    const functionToApply = this.operationMapper.get(filter.getOperator());

    if (!functionToApply) {
      throw Error(`Unexpected operator value ${filter.getOperator()}`);
    }

    functionToApply.bind(this)(filter, queryBuilder);
  }

  private applyComparationFilter<E>(
    filter: Filter,
    queryBuilder: SelectQueryBuilder<E>,
  ): void {
    queryBuilder.andWhere(
      `${this.convertField(filter.getField())} ${filter.getOperator()} :value`,
      { value: filter.getValue() },
    );
  }

  private applyLikeFilter<E>(
    filter: Filter,
    queryBuilder: SelectQueryBuilder<E>,
  ): void {
    queryBuilder.andWhere(
      `${this.convertField(filter.getField())} ${
        filter.getOperator() === Operator.CONTAINS ? 'LIKE' : 'NOT LIKE'
      } :value`,
      { value: filter.getValue() },
    );
  }
}
