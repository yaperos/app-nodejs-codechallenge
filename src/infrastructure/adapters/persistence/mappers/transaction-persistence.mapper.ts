import { TransactionEntity } from '@domain/entities/transaction.entity';
import { TransactionStatusEntity, TransactionStatus } from '@domain/entities/transaction-status.enum';
import { TransactionTypeEntity } from '@domain/entities/transaction-type.entity';
import { TransactionOrmEntity } from '../entities/transaction.entity';
import { TransactionStatusOrmEntity } from '../entities/transaction-status.entity';
import { TransactionTypeOrmEntity } from '../entities/transaction-type.entity';

export class TransactionPersistenceMapper {
  static toDomain(ormEntity: TransactionOrmEntity): TransactionEntity {
    const transactionType = new TransactionTypeEntity(
      ormEntity.transactionType.id,
      ormEntity.transactionType.name,
    );

    const transactionStatus = new TransactionStatusEntity(
      ormEntity.transactionStatus.name as TransactionStatus,
    );

    return new TransactionEntity(
      ormEntity.transactionExternalId,
      ormEntity.accountExternalIdDebit,
      ormEntity.accountExternalIdCredit,
      ormEntity.tranferTypeId,
      Number(ormEntity.value),
      transactionType,
      transactionStatus,
      ormEntity.createdAt,
      ormEntity.updatedAt,
    );
  }

  static toOrm(domainEntity: TransactionEntity): Partial<TransactionOrmEntity> {
    const ormEntity = new TransactionOrmEntity();
    ormEntity.transactionExternalId = domainEntity.transactionExternalId;
    ormEntity.accountExternalIdDebit = domainEntity.accountExternalIdDebit;
    ormEntity.accountExternalIdCredit = domainEntity.accountExternalIdCredit;
    ormEntity.tranferTypeId = domainEntity.tranferTypeId;
    ormEntity.value = domainEntity.value;
    ormEntity.statusId = TransactionPersistenceMapper.getStatusId(
      domainEntity.transactionStatus.name,
    );
    ormEntity.createdAt = domainEntity.createdAt;
    ormEntity.updatedAt = domainEntity.updatedAt;

    return ormEntity;
  }

  private static getStatusId(status: TransactionStatus): number {
    switch (status) {
      case TransactionStatus.PENDING:
        return 1;
      case TransactionStatus.APPROVED:
        return 2;
      case TransactionStatus.REJECTED:
        return 3;
      default:
        return 1;
    }
  }

  static getStatusIdByName(statusName: string): number {
    switch (statusName) {
      case 'pending':
        return 1;
      case 'approved':
        return 2;
      case 'rejected':
        return 3;
      default:
        return 1;
    }
  }
} 