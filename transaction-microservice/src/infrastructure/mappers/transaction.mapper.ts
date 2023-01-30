import { TransactionModel } from "src/domain/model/transaction.model";
import { CreateTransactionDto } from "../controllers/transaction/transaction.dto";
import { Transaction } from "../entities/transaction.entity";

export default class TransactionMapper{

    public static toTransactionModel(transaction: Transaction ): TransactionModel{
        const transactionModel: TransactionModel = new TransactionModel();
        transactionModel.id = transaction.id;
        transactionModel.externalId = transaction.externalId;
        transactionModel.accountExternalIdDebit = transaction.accountExternalIdDebit;
        transactionModel.accountExternalIdCredit = transaction.accountExternalIdCredit;
        transactionModel.transferTypeId = transaction.type?.id;
        transactionModel.value = transaction.value;
        transactionModel.statusId = transaction.status?.id;
        transactionModel.createdAt = transaction.createdAt;
        transactionModel.updatedAt = transaction.updatedAt;
        return transactionModel;
    }

    public static toTransactionEntity(transactionModel: TransactionModel ): Transaction{
        const transaction: Transaction = new Transaction();
        transaction.id = transactionModel.id;
        transaction.externalId = transactionModel.externalId;
        transaction.accountExternalIdDebit = transactionModel.accountExternalIdDebit;
        transaction.accountExternalIdCredit = transactionModel.accountExternalIdCredit;
        transaction.type.id = transactionModel.transferTypeId;
        transaction.value = transactionModel.value;
        transaction.status.id = transactionModel.statusId;
        transaction.createdAt = transactionModel.createdAt;
        transaction.updatedAt = transactionModel.updatedAt;
        return transaction;
    }

    public static toTransactionModelFromDto(transaction: CreateTransactionDto): TransactionModel{
        const transactionModel: TransactionModel = new TransactionModel();
        transactionModel.externalId = transaction.accountExternalIdDebit; //check
        transactionModel.accountExternalIdDebit = transaction.accountExternalIdDebit;
        transactionModel.accountExternalIdCredit = transaction.accountExternalIdCredit;
        transactionModel.transferTypeId = transaction.transferTypeId;
        transactionModel.value = transaction.value;
        return transactionModel;
    }
}