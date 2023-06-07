import { Transaction } from "src/commands/domain/transaction.domain";

export interface UpdateTransactionStatusPort {
    updateTransactionStatus(transaction: Transaction): Promise<Transaction>;
}