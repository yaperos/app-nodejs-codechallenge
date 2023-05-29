import { Transactions } from 'src/adapters/database/mongo/transactions/transactions.schema';
import { TransactionsDto } from '../../../modules/transactions/dto/transactions.dto';

export interface ITransactionsService {
  getTransactionById(id: string): Promise<Transactions>;
  getTransactions(): Promise<Transactions[]>;
  createTransaction(transactionsDto: TransactionsDto): Promise<Transactions>;
  updateTransactionStatus(id: string, status: string): Promise<Transactions>;
}
