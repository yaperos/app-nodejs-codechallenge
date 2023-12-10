import { TransactionType } from '@app/common';

export interface TransactionTypeRepositoryContract {
  findById(id: number): Promise<TransactionType>;
}
