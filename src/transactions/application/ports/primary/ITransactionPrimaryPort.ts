import { TransactionDTO } from 'src/transactions/domain/dtos/transactionDto';
import { TransactionResponse } from 'src/transactions/domain/entities/transaction';

export interface IPrimaryPort {
  createTransaction(dto: TransactionDTO): Promise<TransactionResponse>;
  getTransaction(id: string): Promise<TransactionResponse>;
}
