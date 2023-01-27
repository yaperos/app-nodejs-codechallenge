import { Transaction } from "../aggregates/transaction";

export interface TransactionRepository {
    saveTransaction(transaction: Transaction): Promise<Transaction>;
    getTransactionById(id: string): Promise<Transaction>;
}

