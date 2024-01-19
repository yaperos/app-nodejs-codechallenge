import { Criteria } from 'src/modules/shared/domain/criteria/criteria';
import { DataSource, EntityTarget, SelectQueryBuilder } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { TypeOrmConverter } from './typeorm-converter';

export abstract class TypeOrmRepository<E> {
  protected readonly typeOrmConverter: TypeOrmConverter;

  constructor(
    protected readonly dataSource: DataSource,
    protected readonly fieldMapper: Map<string, string>,
  ) {
    this.typeOrmConverter = new TypeOrmConverter(fieldMapper);
  }

  protected abstract entity(): EntityTarget<E>;

  protected async create(values: QueryDeepPartialEntity<E>): Promise<void> {
    await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(this.entity())
      .values(values)
      .execute();
  }

  protected async update(
    id: string,
    values: QueryDeepPartialEntity<E>,
  ): Promise<number> {
    const { affected } = await this.dataSource
      .createQueryBuilder()
      .update(this.entity())
      .set(values)
      .where('id = :id', { id })
      .execute();

    return affected;
  }

  protected createQueryBuilder(): SelectQueryBuilder<E> {
    return this.dataSource.getRepository(this.entity()).createQueryBuilder('e');
  }

  protected applyCriteria(
    criteria: Criteria,
    queryBuilder: SelectQueryBuilder<E>,
  ) {
    this.typeOrmConverter.applyCriteria(criteria, queryBuilder);
  }

  protected createQueryBuilderByCriteria(
    criteria: Criteria,
  ): SelectQueryBuilder<E> {
    const queryBuilder = this.createQueryBuilder();
    this.applyCriteria(criteria, queryBuilder);
    return queryBuilder;
  }
}
