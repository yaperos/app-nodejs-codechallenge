import { TransactionStatus } from "../../entities/transaction-status.entity";

export interface ITransactionStatusRepository {
    findOneById(id: number): Promise<TransactionStatus | null>;
}