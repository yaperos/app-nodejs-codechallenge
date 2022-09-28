import { Inject } from '@nestjs/common';
import { getMongoManager, MongoRepository } from 'typeorm';
import { Transaction } from '../../application/get-transaction/transaction.query';
import { COMMAND_DATABASE_CONNECTION } from '../constants';
import { TransactionFactory } from '../../domain/factory';
import { TransactionRepository } from '../../domain/repository';
import { TransactionInterface } from '../../domain/transaction';
import { TransactionEntity } from '../entity/transaction.entity';

export class TransactionRepositoryImplement extends MongoRepository<TransactionEntity> implements TransactionRepository {
  constructor(@Inject(TransactionFactory) private readonly transactionFactory: TransactionFactory) {
    super();
  }
  
  async newId(): Promise<string> {
    const emptyEntity = new TransactionEntity();
    const entity = await this.getRepository().save(emptyEntity);
    return entity.id;
  }

  async findById(id: string): Promise<TransactionInterface | null> {
    const entity = await this.getRepository().findOne({ id });
    return entity ? this.entityToModel(entity) : null;
  }

  async saveInfo(data: TransactionInterface): Promise<any> {
    const entity = this.modelToEntity(data);
    await this.getRepository().save(entity);
    return this.convertAccountFromEntity(data);
  }

  private modelToEntity(model: TransactionInterface): TransactionEntity {
    const properties = model.properties();
    return {
      ...properties,
      createdAt: properties.openedAt,
      deletedAt: properties.closedAt,
    };
  }

  private entityToModel(entity: TransactionEntity): TransactionInterface {
    return this.transactionFactory.reconstitute({
      ...entity,
      openedAt: entity.createdAt,
      closedAt: entity.deletedAt,
    });
  }

  private convertAccountFromEntity(model?: TransactionInterface): undefined | Transaction {
    const properties = model.propertiesResponse();
    return properties;
  }

  private getRepository(): MongoRepository<TransactionEntity> {
    return getMongoManager(COMMAND_DATABASE_CONNECTION).getMongoRepository(TransactionEntity);
  }
}
