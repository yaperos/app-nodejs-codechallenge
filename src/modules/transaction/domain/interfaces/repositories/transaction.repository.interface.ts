import { Transaction } from "../../entities/transaction.entity";

export interface ITransactionRepository {
    findOneById(id: number): Promise<Transaction | null>;
    save(entity: Transaction): Promise<Transaction>;
}