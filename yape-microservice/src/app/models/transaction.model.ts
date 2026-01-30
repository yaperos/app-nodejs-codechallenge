export interface CreateTransactionRequest {
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  transferTypeId: number;
  value: number;
}

export interface TransactionResponse {
  transactionExternalId: string;
  transactionStatus: string;
  value: number;
  createdAt: string;
}