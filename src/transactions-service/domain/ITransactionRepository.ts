import { Transaction } from './Transaction';

export interface ITransactionRepository {
    create(transaction: Transaction): Promise<Transaction>;
    getById(id: string): Promise<Transaction | null>;
    updateTransactionStatus(transaction: Transaction): Promise<Transaction | null>;
}
