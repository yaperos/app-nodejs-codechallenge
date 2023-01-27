import { Transaction } from "../../../src/domain/aggregates/transaction";
import { TransactionEntity } from "../entities/transaction.entity";

export class TransactionMapper {
    static toEntity(transaction: Transaction): TransactionEntity {
        const transactionEntity = new TransactionEntity();
        transactionEntity.transactionExternalId = transaction.getTransactionExternalId();
        transactionEntity.accountExternalIdDebit = transaction.getAccountExternalIdDebit();
        transactionEntity.accountExternalIdCredit = transaction.getAccountExternalIdCredit();
        transactionEntity.tranferType = transaction.getTranferType();
        transactionEntity.status = transaction.getStatus();
        transactionEntity.value = transaction.getValue();
        return transactionEntity;
    }

    static toDomain(transactionEntity: TransactionEntity): Transaction {
        const transaction = new Transaction({
            transactionExternalId: transactionEntity.transactionExternalId,
            accountExternalIdDebit: transactionEntity.accountExternalIdDebit,
            accountExternalIdCredit: transactionEntity.accountExternalIdCredit,
            tranferType: transactionEntity.tranferType,
            status: transactionEntity.status,
            value: transactionEntity.value,
        });
        return transaction;
    }
}