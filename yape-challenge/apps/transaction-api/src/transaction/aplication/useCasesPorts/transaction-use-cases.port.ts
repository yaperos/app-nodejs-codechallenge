import { CreateTransactionDTO } from "../dtos/create-transaction.dto";
import { GetTransactionDTO } from "../dtos/get-transaction.dto";
import { TransactionDTO } from "../dtos/transaction.dto";

export interface ITransactionUseCasesPort {
    getById(id: string): Promise<TransactionDTO>;
    create(dto: CreateTransactionDTO): Promise<TransactionDTO>;
    update(id: string, status: string): Promise<TransactionDTO>;
    get(dto: GetTransactionDTO): Promise<TransactionDTO[]>;
}