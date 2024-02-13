import { StatusStrings } from '@app/common/constants';
import { Transaction } from '../model/transaction.model';

export interface TransactionRepository {
  save(transaction: Transaction): Promise<Transaction>;
  findById(id: string): Promise<Transaction | undefined>;
  updateStatusById(id: string, status: StatusStrings): Promise<void>;
}
