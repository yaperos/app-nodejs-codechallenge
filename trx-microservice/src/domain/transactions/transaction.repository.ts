import { Transaction, CreateTransaction, TRANSACTION_STATUS } from './transaction'


export abstract class TransactionRepository {
    abstract findById(id: string): Promise<Transaction | null>
    abstract create(transaction: CreateTransaction): Promise<Transaction>
    abstract updateStatus(id: string, status: TRANSACTION_STATUS): Promise<Transaction>
}