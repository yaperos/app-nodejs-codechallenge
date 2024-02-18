export interface TransactionData {
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  tranferTypeId: number;
  value: number;
}

interface TransactionType {
  name: string;
}

interface TransactionStatus {
  name: string;
}

export interface TransactionResponse {
  transactionExternalId: string;
  transactionType: TransactionType;
  transactionStatus: TransactionStatus;
  value: number;
  createdAt: Date;
}
