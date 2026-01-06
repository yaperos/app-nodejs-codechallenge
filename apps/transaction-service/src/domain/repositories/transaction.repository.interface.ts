import type { Transaction } from '../entities/transaction.entity';

export interface ITransactionRepository {
    save(transaction: Transaction): Promise<Transaction>;
    findByExternalId(externalId: string): Promise<Transaction | null>;
    update(transaction: Transaction): Promise<Transaction>;
}

export const TRANSACTION_REPOSITORY = Symbol('TRANSACTION_REPOSITORY');
