import { EntityTarget, FindOptionsWhere, Repository } from 'typeorm';
import { AppDataSource } from '@context/shared/infrastructure/persistence/typeorm/conf/typeorm.config';
import { BaseEntity } from '@context/shared/infrastructure/persistence/typeorm/entities/BaseEntity';
import { IBaseRepository } from '@context/shared/domain/contracts/IBaseRepository';

export abstract class BaseRepository<T extends BaseEntity>
implements IBaseRepository<T> {
  protected repository: Repository<T>;

  constructor(private Entity: EntityTarget<T>) {
    this.repository = AppDataSource.getRepository(this.Entity);
  }

  async create(entity: T): Promise<T> {
    const entityCreate = await this.repository.save(entity);
    return entityCreate;
  }
  async getAll(): Promise<T[]> {
    const entities = await this.repository.find();
    return entities;
  }

  async getById(id?: number): Promise<T> {
    const criteria = { where: { id: id } as FindOptionsWhere<T> };
    const entity = await this.repository.findOne(criteria);
    return entity as T;
  }

  async getByTransactionExternalId(transactionExternalId?: number): Promise<T> {
    const criteria = { where: { transactionExternalId } as FindOptionsWhere<T> };
    const entity = await this.repository.findOne(criteria);
    return entity as T;
  }

  async upsert(entity: T): Promise<T> {
    await this.repository.upsert(entity as any, ['id']);
    return entity;
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  protected getEntityType(): EntityTarget<T> {
    return this.Entity;
  }
}
