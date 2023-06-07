import { Transaction } from "src/antifraud/domain/transaction.domain";

export interface ValidateTransactionPort {
    validateTransaction(transaction: Transaction);
}