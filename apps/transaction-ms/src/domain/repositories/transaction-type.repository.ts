import { TransactionType } from '../model/transaction.model';

export interface TransactionTypeRepository {
  findById(id: number): TransactionType | undefined;
  findAll(): TransactionType[];
}
