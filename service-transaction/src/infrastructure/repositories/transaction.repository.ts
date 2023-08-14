import TransactionEntity from "../../domain/transaction.entity";
import { ITransactionRepository } from "../../domain/transaction.repository";
import { Transaction } from "../models/db/transaction.schema"
import DateUtil from "../../libs/date"

export class TransactionRepository implements ITransactionRepository {
    async createTransaction(transaction: TransactionEntity): Promise<TransactionEntity | null> {
        let tr = new Transaction();

        tr.transactionExternalId = transaction.transactionExternalId!
        tr.accountExternalIdCredit = transaction.accountExternalIdCredit
        tr.accountExternalIdDebit = transaction.accountExternalIdDebit
        tr.value = transaction.value
        tr.tranferTypeId = transaction.tranferTypeId
        tr.status = transaction.status!
        tr.createdAt = transaction.createdAt!
        tr.createdAtTimestamp = transaction.createdAtTimestamp!

        return await tr.save()
    }
    async findTransactionById(transactionExternalId: string): Promise<TransactionEntity | null> {
        let transaction = await Transaction.findOneBy({
            transactionExternalId: transactionExternalId
        })
        return transaction
    }
    async updateTransactionStatus(transactionExternalId: string, status: number): Promise<TransactionEntity | null> {        
        let transaction = await Transaction.findOneBy({
            transactionExternalId: transactionExternalId
        })

        if(transaction === null){
            return null;
        }

        const now = DateUtil.getCurrentDate()
        transaction.status = status;
        transaction.updatedAt = now.dateTime;
        transaction.updatedAtTimestamp = now.timestamp;

        return transaction.save();
    }
}