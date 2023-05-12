import { Transaction } from "../entities/transaction.entity";

export interface ITransactionRepository {
    findAllAsync(): Promise<Transaction[]>;
    findOneAsync(prmTransactionExternalId: string): Promise<Transaction>;
    searchByAsync(prmTransactionExternalId: string): Promise<Transaction>;
    saveAsync(item: Transaction): Promise<Transaction>;
}