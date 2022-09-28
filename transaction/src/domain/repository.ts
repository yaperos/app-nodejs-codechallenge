import { TransactionInterface } from './transaction';

export interface TransactionRepository {
  newId: () => Promise<string>;
  saveInfo: (transaction: TransactionInterface) => Promise<void>;
  findById: (id: string) => Promise<TransactionInterface | null>;
}
