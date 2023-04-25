import { Prisma, Transaction, TransactionStatus, TransactionType } from "@prisma/client"

export class TransactionResponseDto {
    transactionExternalId: string
    transactionType: {
        name: string
    }
    transactionStatus: {
        name: string
    }
    value: number
    createdAt: Date

    constructor(transaction: TransactionFull) {
        this.transactionExternalId = transaction.externalId
        this.transactionType = {
            name: transaction.transactionType.name
        }
        this.transactionStatus = {
            name: transaction.transactionStatus.name
        }
        this.value = transaction.value.toNumber()
        this.createdAt = transaction.createdAt
    }
}

type TransactionFull = Transaction & {
    transactionType: TransactionType;
    transactionStatus: TransactionStatus;
}