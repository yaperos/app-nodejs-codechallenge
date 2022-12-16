import { TransactionStatus } from './transaction_status.enum';

export interface Transaction {
  transactionExternalId?: string;
  value: number;
  createAt: Date;
  version: number;
  status: TransactionStatus;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  transferTypeId: number;
}
