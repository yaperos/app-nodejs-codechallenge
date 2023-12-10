import { Transaction } from '@app/common';

export interface TransactionRepositoryContract {
  findById(id: string): Promise<Transaction>;
  findAll(take?: number, skip?: number): Promise<Transaction[]>;
  save(input: Transaction): Promise<Transaction>;
}
