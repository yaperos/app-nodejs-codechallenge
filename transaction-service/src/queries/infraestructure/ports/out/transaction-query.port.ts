import { Transaction } from "src/queries/domain/transaction.domain";

export interface TransactionQueryPort {
    getTransaction(transaction: Transaction): Promise<Transaction>;
}