import { Transaction } from "../entities/transaction.entity";

export abstract class TransactionRepositoryPort {
    abstract save(transaction: Transaction): Promise<void>;
    abstract update(transaction: Transaction): Promise<void>;
    abstract findById(id: string): Promise<Transaction | null>;
}