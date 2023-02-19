import { Transaction } from './transaction.model';

export interface TransactionRepository {
    save(transaction: Transaction): Promise<Transaction>;
}

export const TransactionRepository = Symbol('TransactionRepository');
