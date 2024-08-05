import { Transaction } from '../entities/transaction.entity';

export interface ITransactionRepository {
  create(transactionRegister: Transaction): Promise<Transaction>;
  update(transaction: Transaction): Promise<Transaction>;
  findById(id: string): Promise<Transaction>;
}
