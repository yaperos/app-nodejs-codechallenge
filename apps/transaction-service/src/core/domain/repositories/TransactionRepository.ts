import { Transaction, TransactionType } from '../models';

export type TransactionInsertData = {
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  transactionType: TransactionType;
  value: number;
};

export interface TransactionRepository {
  insert(data: TransactionInsertData): Promise<Transaction>;
}
