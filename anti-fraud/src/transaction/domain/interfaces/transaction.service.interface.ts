import { Transaction } from '../entities/transaction.type';

export interface TransactionServiceInterface {
  check(message: Transaction): Promise<boolean>;
}
