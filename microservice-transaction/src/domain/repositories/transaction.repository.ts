import { TransactionEntity } from '../model/transaction.model';

export interface TransactionRepository {
  insert(todo: TransactionEntity): Promise<TransactionEntity>;
  findAll(): Promise<TransactionEntity[]>;
  findById(id: string): Promise<TransactionEntity>;
  updateContent(id: string, status: string): Promise<TransactionEntity>;
}
