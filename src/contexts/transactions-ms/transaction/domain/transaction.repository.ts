import { TransactionModel } from './transaction.model';

export interface TransactionRepository {
    save(transaction: TransactionModel): Promise<TransactionModel>;
}

export const TransactionRepository = Symbol('TransactionRepository');
