import { Transaction, TransferType } from '../models';

export interface TransactionRepository {
  getById(id: string): Promise<Transaction>;

  add(model: {
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    tranferTypeId: TransferType;
    value: number;
  }): Promise<Transaction>;

  update(id: string, transaction: Partial<Transaction>): Promise<void>;
}

export const TransactionRepository = Symbol('TransactionRepository');
