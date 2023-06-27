import { TransactionType } from "../types/transaction.interface"

export interface CacheDatabaseInterface {
    process(transaction:TransactionType):Promise<any>
}