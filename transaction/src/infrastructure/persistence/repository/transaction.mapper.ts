import { TransactionModel } from '../../../domain/transaction.model';
import { TransactionEntity } from '../transaction.entity';

export class TransactionMapper {
  toPersistence(model: TransactionModel): TransactionEntity {
    const entity = new TransactionEntity();

    entity.id = model.id;
    entity.transferTypeId = model.transferTypeId;
    entity.value = model.value;
    entity.status = model.status;
    entity.accountExternalIdDebit = model.accountExternalIdDebit;
    entity.accountExternalIdCredit = model.accountExternalIdCredit;
    entity.createdAt = model.createdAt;

    return entity;
  }

  toDomain(entity: TransactionEntity): TransactionModel {
    const model = new TransactionModel({
      id: entity.id,
      transferTypeId: entity.transferTypeId,
      value: entity.value,
      status: entity.status,
      accountExternalIdDebit: entity.accountExternalIdDebit,
      accountExternalIdCredit: entity.accountExternalIdCredit,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });

    return model;
  }
}
