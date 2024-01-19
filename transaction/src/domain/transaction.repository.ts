import { Transaction } from './transaction'

export interface TransactionRepository {
    save(transaction: Transaction): Promise<Transaction>;
    findById(transactionExternalId: string): Promise<Transaction>;
}