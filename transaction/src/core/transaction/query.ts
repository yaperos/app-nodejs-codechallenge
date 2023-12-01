import { TransactionStatus } from "@prisma/client";

export class Transaction {
    id: number;
    accountExternalIdDebit: string
    accountExternalIdCredit: string
    tranferTypeId: number
    status: TransactionStatus
    value: number
    isDeleted: boolean
    createdAt: number
    updatedAt: number

    static of(body: Partial<Transaction>): Transaction {
        const query = new Transaction()

        Object.assign(query, body)

        return query
    }
}

export interface TransactionMsg {
    id: number;
    status: TransactionStatus
}