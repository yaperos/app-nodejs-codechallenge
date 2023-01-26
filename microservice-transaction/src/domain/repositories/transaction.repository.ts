import { Transaction } from "../aggregates/transaction";

export interface TransactionRepository {
    createTransaction(transaction: Transaction): Promise<Transaction>;
    getTransactionById(id: string): Promise<Transaction>;
}

