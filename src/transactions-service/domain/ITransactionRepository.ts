import { Transaction } from './Transaction';

export interface ITransactionRepository {
    create(transaction: Transaction): Promise<Transaction>;
    getById(id: string): Promise<Transaction | null>;
    update(transaction: Transaction): Promise<Transaction>;
}
