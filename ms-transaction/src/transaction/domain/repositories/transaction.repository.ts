import { TransactionModel } from '../models/transaction.model';
import { TransactionStatus } from '../enums/transaction-status.enum';

export interface TransactionRepository {
  save(transaction: TransactionModel): Promise<void>;
  getById(id: string): Promise<TransactionModel | null>;
  updateStatus(id: string, status: TransactionStatus): Promise<void>;
}

export const TransactionRepository = Symbol('TransactionRepository');
