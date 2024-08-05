import { TransactionType } from '../entities/transaction-type.entity';

export interface ITransactionTypeRepository {
  findById(id: number): Promise<TransactionType>;
}
