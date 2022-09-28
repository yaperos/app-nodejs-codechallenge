import { MongoRepository, getMongoManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { TransactionEntity } from '../entity/transaction.entity';
import { Transaction, TransactionQuery } from '../../application/get-transaction/transaction.query';
import { TransactionImplement } from '../../domain/transaction';
import { COMMAND_DATABASE_CONNECTION } from '../constants';

@Injectable()
export class TransactionQueryImplement extends MongoRepository<TransactionEntity> implements TransactionQuery {
  async findById(id: string): Promise<undefined | Transaction> {
    return this.convertAccountFromEntity(await this.getRepository().findOne({ where: { id } }));
  }

  private convertAccountFromEntity(entity?: TransactionEntity): undefined | Transaction {
    if (entity) {
      const model = new TransactionImplement({
        id: entity.id,
        accountExternalIdDebit: entity.accountExternalIdDebit,
        accountExternalIdCredit: entity.accountExternalIdCredit,
        tranferTypeId: entity.tranferTypeId,
        value: entity.value,
        transactionStatus: entity.transactionStatus,
        openedAt: entity.createdAt,
      });
      const properties = model.propertiesResponse();
      return properties;
    }
    return undefined;
  }

  private getRepository(): MongoRepository<TransactionEntity> {
    return getMongoManager(COMMAND_DATABASE_CONNECTION).getMongoRepository(TransactionEntity);
  }
}
