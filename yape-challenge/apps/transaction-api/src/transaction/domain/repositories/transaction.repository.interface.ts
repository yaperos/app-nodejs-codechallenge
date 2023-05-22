import { Transaction } from '../entities/transaction';

export interface ITransactionRepository {
    getById(id: string): Promise<Transaction>;
    create(entity: Transaction): Promise<Transaction>;
    update(entity: Transaction): Promise<Transaction>;
    get(transactionStatus: string, tranferTypeId: number, createdAt: string): Promise<Transaction[]>;
}