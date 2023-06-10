import { TransactionType } from '../../enums/transaction-type';

export interface TransactionEntityDto {
  transactionExternalId: string;
  transactionType: TransactionType;
  value: number;
  accountExternalIdDebit?: string;
  accountExternalIdCredit?: string;
  transactionStatus: string;
  createdAt?: Date;
}
