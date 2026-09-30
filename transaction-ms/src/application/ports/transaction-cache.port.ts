import { TransactionView } from "../dtos/transaction.view";

export abstract class TransactionCachePort {
    abstract get(id: string): Promise<TransactionView | null>
    abstract set(view: TransactionView, ttlSeconds: number): Promise<void>
    abstract invalidate(id: string): Promise<void>
}