import { Transaction } from "src/domain/transaction";
import { TransactionEntity } from "src/infrastructure/entities/transaction.entity";
import { TransactionStatus } from "./constants";

export class TransactionUtils{
    static fromTransactionEntityToTransaction(transactionEntity: TransactionEntity): Transaction{
        return new Transaction({
            transactionExternalId: transactionEntity.transactionExternalId,
            accountExternalIdDebit: transactionEntity.accountExternalIdDebit,
            accountExternalIdCredit: transactionEntity.accountExternalIdCredit,
            transferTypeId: transactionEntity.transferTypeId,
            value: transactionEntity.value,
            status: transactionEntity.status,
          });
    }

    static fromTransactionToTransactionEntity(transaction: Transaction): TransactionEntity{
         const transactionEntity =  new TransactionEntity();
         const {
            transactionExternalId,
            accountExternalIdDebit,
            accountExternalIdCredit,
            transferTypeId,
            value,
            status,
            createdAt,
            updatedAt,
        } = transaction.getAllProperties();

        transactionEntity.transactionExternalId = transactionExternalId;
        transactionEntity.accountExternalIdDebit = accountExternalIdDebit;
        transactionEntity.accountExternalIdCredit = accountExternalIdCredit;
        transactionEntity.transferTypeId = transferTypeId;
        transactionEntity.value = value;
        transactionEntity.status = status;
        transactionEntity.createdAt = createdAt;
        transactionEntity.updatedAt = updatedAt;
        return transactionEntity;
    }

    static fromTransactionToReponse(transaction: Transaction): any{
        const {
            transactionExternalId,
            transferTypeId,
            value,
            status,
            createdAt,
        } = transaction.getAllProperties();
        console.log("status: ", status)
        return {
            transactionExternalId,
            transactionType: {
              name: transferTypeId,
            },
            transactionStatus: {
              name: TransactionStatus[status],
            },
            value,
            createdAt
          };
    }

    static fromTransactionToCreateTransactionResponse(transaction: Transaction) {
      const {
        transactionExternalId,
        accountExternalIdDebit,
        accountExternalIdCredit,
        transferTypeId,
        value,
        status,
        createdAt
    } = transaction.getAllProperties();
      return {
        transactionExternalId,
        accountExternalIdDebit,
        accountExternalIdCredit,
        transferTypeId,
        value,
        status,
        createdAt
    } ;
    }
}