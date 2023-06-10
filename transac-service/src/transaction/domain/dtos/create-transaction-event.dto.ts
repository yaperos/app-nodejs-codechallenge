import { TransactionType } from '../enums/transaction-type';

export interface CreateTransactionEventDto {
  type: string;
  transactionId: string;
  transferTypeId: TransactionType;
  value: number;
  accountExternalIdDebit?: string;
  accountExternalIdCredit?: string;
}
