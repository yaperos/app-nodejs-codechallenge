import { Transaction } from '../models';
import { TransactionCreator } from '../types';

export const TRANSACTION_REPOSITORY = 'TRANSACTION_REPOSITORY';

export interface ITransactionRepository {
  save(data: TransactionCreator): Promise<Transaction>;
  findById(id: string): Promise<Transaction | null>;
  updateStatusById(id: string, status: string): Promise<Transaction | null>;
}
