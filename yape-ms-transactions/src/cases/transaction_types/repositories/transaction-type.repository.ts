import { TransactionType } from '../models';

export const TRANSACTION_TYPE_REPOSITORY = 'TRANSACTION_TYPE_REPOSITORY';

export interface ITransactionTypeRepository {
  findAll(): Promise<TransactionType[]>;
  findById(id: number): Promise<TransactionType | null>;
}
