import { TransactionDTO } from 'src/transactions/domain/dtos/transactionDto';
import { Transaction } from 'src/transactions/domain/entities/transaction';

export interface ISecondaryPort {
  createTransaction(dto: TransactionDTO): Promise<Transaction>;
  updateTransactionStatus(transactionId: string, status: string): Promise<void>;
  updateTransactionStatusQueue(
    transactionId: string,
    status: string,
  ): Promise<void>;
  getTransaction(transactionId: string): Promise<Transaction>;
}
