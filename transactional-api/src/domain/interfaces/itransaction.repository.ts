import { Transaction } from "../entities/transaction.entity";

export interface ITransactionRepository{
    searchByAsync(prmTransactionExternalId: string): Promise<Transaction>;
    saveAsync(item: Transaction): Promise<Transaction>;
}