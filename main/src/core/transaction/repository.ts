import { Transaction,CreateTransactionQuery, SearchTransactionQuery } from "./query"

export interface TransactionRepository {
    create(data: CreateTransactionQuery): Promise<Transaction>
    getById(id: number): Promise<Transaction | null>
    search(query: SearchTransactionQuery): Promise<Transaction[]>
    count(query: SearchTransactionQuery): Promise<number>
    update(id: number, status: string): Promise<Transaction>
    delete(id: number): Promise<Transaction>
}
