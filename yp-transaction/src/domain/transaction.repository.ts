import TransactionEntity from "./transaction.entity"

export interface ITransactionRepository {
    createTransaction(transaction: TransactionEntity): Promise<TransactionEntity | null>
    findTransactionById(transactionExternalId: string): Promise<TransactionEntity | null>
    updateTransactionStatus(transactionExternalId: string, status: number): Promise<TransactionEntity | null>
}