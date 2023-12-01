import { Transfer,CreateTransferQuery, SearchTransferQuery } from "./query"

export interface TransferRepository {
    create(data: CreateTransferQuery): Promise<Transfer>
    search(query: SearchTransferQuery): Promise<Transfer[]>
    count(query: SearchTransferQuery): Promise<number>
    delete(id: number): Promise<Transfer>
}
