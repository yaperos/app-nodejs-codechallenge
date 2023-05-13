import {CreateTransactionDto } from "../../../transaction/src/transactions/dto/create-transaction.dto";

export type AntiFraudInput = CreateTransactionDto & {
    transactionExternalId: string
}