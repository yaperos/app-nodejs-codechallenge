import { Transaction, TransactionType } from '../models';

export type TransactionInsertData = {
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  transactionType: TransactionType;
  value: number;
};

export type TransactionUpdateData = {
  status: string;
  annotations?: string;
};

export interface TransactionRepository {
  insert(data: TransactionInsertData): Promise<Transaction>;
  update(id: string, data: TransactionUpdateData): Promise<Transaction>;
  get(externalId: string): Promise<Transaction>;
}
