import { Status } from '@app/common/constants';

export interface Transaction {
  id?: string;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  transactionTypeId: number;
  status?: Status;
  amount: number;
  createdAt?: Date;
}

export interface TransactionType {
  id?: number;
  name: string;
}
