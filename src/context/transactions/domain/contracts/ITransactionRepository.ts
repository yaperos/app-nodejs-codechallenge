import Transaction from '@context/transactions/domain/class/Transaction';

export interface ITransactionRepository {
  findByExternalId(externalId: number): Promise<Transaction>;
  createTransaction(transaction: Transaction): Promise<string>;
  updateTransaction(transaction: Transaction): Promise<Transaction>;
}
