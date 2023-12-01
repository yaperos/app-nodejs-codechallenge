import { Transaction } from "./query"

export interface TransactionRepository {
    getById(id: number): Promise<Transaction>
    update(id: number, status: string): Promise<Transaction>
}
