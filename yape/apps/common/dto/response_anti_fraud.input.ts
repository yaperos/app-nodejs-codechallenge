import {CreateTransactionInput} from "./create_transaction_input";

export type ResponseAntiFraudInput = CreateTransactionInput & {
    transactionExternalId: string
    status: number
}