import { Transaction } from "src/queries/domain/transaction.domain";

export interface CreateTransactionPort {
    createTransaction(transaction: Transaction);
}