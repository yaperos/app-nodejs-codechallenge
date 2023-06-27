import { TransactionType } from "../types/transaction.interface";

export interface AntiFraudInterface {
    verify(transaction:TransactionType):boolean
}