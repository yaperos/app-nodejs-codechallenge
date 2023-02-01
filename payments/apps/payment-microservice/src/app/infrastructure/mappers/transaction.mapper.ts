import { CreateTransactionDto, UpdateTransactionDto } from "@payments/shared/dto";
import { TransactionModel, TransactionStatusModel, TransactionTypeModel } from "@payments/shared/model";
import { TransactionStatus } from "../entities/transaction-status.entity";
import { TransactionType } from "../entities/transaction-type.entity";
import { Transaction } from "../entities/transaction.entity";

export default class TransactionMapper{

    public static toTransactionModel(transaction: Transaction ): TransactionModel{
        const transactionModel: TransactionModel = new TransactionModel();
        transactionModel.id = transaction.id;
        transactionModel.externalId = transaction.externalId;
        transactionModel.accountExternalIdDebit = transaction.accountExternalIdDebit;
        transactionModel.accountExternalIdCredit = transaction.accountExternalIdCredit;
        transactionModel.typeId = transaction.type?.id;
        transactionModel.type = new TransactionTypeModel(transaction.type?.id, transaction.type?.description);
        transactionModel.value = transaction.value;
        transactionModel.statusId = transaction.status?.id;
        transactionModel.status = new TransactionStatusModel(transaction.status?.id, transaction.status?.description);
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
        transaction.type = {id: transactionModel.typeId}  as TransactionType;
        transaction.value = transactionModel.value;
        transaction.status = {id: transactionModel.statusId} as TransactionStatus;
        transaction.createdAt = transactionModel.createdAt;
        transaction.updatedAt = transactionModel.updatedAt;
        return transaction;
    }

    public static toTransactionModelFromCreateTransactionDto(transaction: CreateTransactionDto): TransactionModel{
        const transactionModel: TransactionModel = new TransactionModel();
        transactionModel.accountExternalIdDebit = transaction.accountExternalIdDebit;
        transactionModel.accountExternalIdCredit = transaction.accountExternalIdCredit;
        transactionModel.typeId = transaction.transferTypeId;
        transactionModel.value = transaction.value;
        return transactionModel;
    }

    public static toTransactionModelFromUpdateTransactionDto(transaction: UpdateTransactionDto): TransactionModel{
        const transactionModel: TransactionModel = new TransactionModel();
        transactionModel.externalId = transaction.externalId;
        transactionModel.status = new TransactionTypeModel(0, transaction.status);
        return transactionModel;
    }
}