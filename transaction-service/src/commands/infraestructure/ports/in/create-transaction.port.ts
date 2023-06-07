import { Transaction } from "src/commands/domain/transaction.domain";

export interface CreateTransactionPort {
    createTransaction(transaction: Transaction): Promise<Transaction>;
}