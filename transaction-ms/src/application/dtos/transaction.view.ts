import { Transaction } from "../../domain/entities/transaction.entity";
import { transferTypeName } from "../../domain/value-objects/transfer-type";

export interface TransactionView {
    transactionExternalId: string;
    transactionType: { name: string }
    transactionStatus: { name: string }
    value: number
    createdAt: string
}

export function toTransactionView(transaction: Transaction): TransactionView {
    return {
        transactionExternalId: transaction.id,
        transactionType: { name: transferTypeName(transaction.transferTypeId) },
        transactionStatus: { name: transaction.status },
        value: transaction.value.amount,
        createdAt: transaction.createdAt.toISOString(),
    }
}