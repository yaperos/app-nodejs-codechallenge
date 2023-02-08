import {CreateTransactionInput} from "../../../common/dto/create_transaction_input";

export type AntiFraudInput = CreateTransactionInput & {
    transactionExternalId: string
}