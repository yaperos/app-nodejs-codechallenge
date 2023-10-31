import { TransactionType } from '../models';

export interface TransactionTypeRepository {
  getById(id: number): Promise<TransactionType | null>;
}
