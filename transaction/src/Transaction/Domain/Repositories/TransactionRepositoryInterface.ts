import {Transaction} from "../Entities/Transaction";
import {CreateTransactionDto} from "../Dtos/CreateTransactionDto";

export interface TransactionRepositoryInterface {
    create(transaction: CreateTransactionDto): Promise<Transaction>;
    findById(id: string): Promise<Transaction | null>;
    updateStatus(id: string, status: string): Promise<Transaction>;
}
