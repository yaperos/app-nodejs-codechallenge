import { Transaction } from '../../domain/transaction';
import { TransactionEntity } from '../entities/transaction.entity';

export class MapperDto {
  static domainToEntity(transaction: Transaction): TransactionEntity {
    const transactionEntity = new TransactionEntity();
    transactionEntity.transactionExternalId = transaction.data().transactionExternalId;
    transactionEntity.accountExternalIdCredit = transaction.data().accountExternalIdCredit;
    transactionEntity.accountExternalIdDebit = transaction.data().accountExternalIdDebit;
    transactionEntity.tranferTypeId = transaction.data().transferTypeId;
    transactionEntity.value = transaction.data().value;
    transactionEntity.status = transaction.data().status;
    
    return transactionEntity;
  }

  static entityToDomain(transactionEntity: TransactionEntity): Transaction {
    return new Transaction(
        {
            transactionExternalId: transactionEntity.transactionExternalId,
            accountExternalIdDebit: transactionEntity.accountExternalIdDebit,
            accountExternalIdCredit: transactionEntity.accountExternalIdCredit,
            tranferTypeId: transactionEntity.tranferTypeId,
            value: transactionEntity.value,
            status: transactionEntity.status
        }
    );
  }
}
