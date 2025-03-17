export interface UpdateTransactionRequest {
  accountExternalIdDebit?: string;
  accountExternalIdCredit?: string;
  transactionExternalId: string;
  transactionType: {
    name: string;
  };
  transactionStatus: {
    name: string;
  };
  value: number;
  createdAt: Date;
}
