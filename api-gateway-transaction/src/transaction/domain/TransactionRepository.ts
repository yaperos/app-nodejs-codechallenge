import { Transaction } from './Transaction';
import { TransactionResponse } from './TransactionResponse';

export abstract class TransactionRepository {
  abstract create(transaction: Transaction): Promise<void>;

  abstract getById(id: string): Promise<TransactionResponse>;
}
