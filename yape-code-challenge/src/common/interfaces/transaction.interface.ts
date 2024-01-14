import { TransactionStatusEnum } from '@/enums/transaction-status.enum';

export interface ITransaction {
  value: number;
  transactionExternalId: string;
  transferTypeId: number;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
}

export interface ITransactionUpdate {
  transactionExternalId: string;
  status: TransactionStatusEnum;
}
