import { TransactionStatus } from './transaction_status.enum';

export interface Transaction {
  id?: number;
  value: number;
  createAt: Date;
  version: number;
  status: TransactionStatus;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  tranferTypeId: number;
}
