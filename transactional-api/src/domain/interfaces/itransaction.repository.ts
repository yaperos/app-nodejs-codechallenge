import { Transaction } from "../entities/transaction.entity";

export interface ITransactionRepository{
    create(item: Transaction): Promise<Transaction>;
}