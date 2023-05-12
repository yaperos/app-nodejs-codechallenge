export class Transaction {
  transactionExternalId: string;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  transactionTypeId?: number;
  transactionType?: TransactionType;
  transactionStatusId?: number;
  transactionStatus?: TransactionStatus;
  value: number;
  createdAt: string;
  updatedAt: string;
}

export class TransactionType {
  id?: number;
  name: string;
}

export class TransactionStatus {
  id?: number;
  name: string;
}
