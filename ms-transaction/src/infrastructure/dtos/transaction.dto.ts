import { Transaction } from '../../domain/aggregates/transaction';
import { TransactionEntity } from '../entities/transaction.entity';

export class TransactionDto {
  static fromDomainToEntity(transaction: Transaction): TransactionEntity {
    const transactionEntity = new TransactionEntity();
    transactionEntity.transactionExternalId =
      transaction.properties().transactionExternalId;
    transactionEntity.accountExternalIdCredit =
      transaction.properties().accountExternalIdCredit;
    transactionEntity.accountExternalIdDebit =
      transaction.properties().accountExternalIdDebit;
    transactionEntity.tranferTypeId = transaction.properties().tranferTypeId;
    transactionEntity.value = transaction.properties().value;
    transactionEntity.status = transaction.properties().status;
    return transactionEntity;
  }

  static fromEntityToDomain(transactionEntity: TransactionEntity): Transaction {
    return new Transaction({
      transactionExternalId: transactionEntity.transactionExternalId,
      accountExternalIdDebit: transactionEntity.accountExternalIdDebit,
      accountExternalIdCredit: transactionEntity.accountExternalIdCredit,
      tranferTypeId: transactionEntity.tranferTypeId,
      value: transactionEntity.value,
      status: transactionEntity.status,
    });
  }
}
