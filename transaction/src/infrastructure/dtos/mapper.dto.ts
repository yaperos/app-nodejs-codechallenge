import { Transaction } from '../../domain/transaction';
import { TransactionEntity } from '../entities/transaction.entity';

export class MapperDto {
  static domainToEntity(transaction: Transaction): TransactionEntity {
    const transactionEntity = new TransactionEntity();
    console.log(transaction.data())
    transactionEntity.transactionExternalId = transaction.data().transactionExternalId;
    transactionEntity.accountExternalIdCredit = transaction.data().accountExternalIdCredit;
    transactionEntity.accountExternalIdDebit = transaction.data().accountExternalIdDebit;
    transactionEntity.transferTypeId = transaction.data().transferTypeId;
    transactionEntity.value = transaction.data().value;
    transactionEntity.status = transaction.data().status;
    
    return transactionEntity;
  }

  static entityToDomain(transactionEntity: TransactionEntity): Transaction {
    return new Transaction(
        {
            transactionExternalId: transactionEntity.transactionExternalId,
            accExternalIdDebit: transactionEntity.accountExternalIdDebit,
            accExternalIdCredit: transactionEntity.accountExternalIdCredit,
            transferTypeId: transactionEntity.transferTypeId,
            value: transactionEntity.value,
            status: transactionEntity.status
        }
    );
  }
}
