export class TransactionResponseDB {
  transactionStatus?: string;
  transactionType?: string;
  value?: number;
  createdAt?: Date;
  id?: string;
  accountExternalIdDebit?: string;
  accountExternalIdCredit?: string;
  updatedAt?: Date;
  transactionTypeId?: number;
  transactionStatusId?: number;
  version?: number;
}
