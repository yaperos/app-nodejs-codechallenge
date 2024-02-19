export interface ITransactionRequest {
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  transferTypeId: number;
  value: number;
}

export interface ITransactionResponse {
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

export interface ITransactionEvent {
  transactionExternalId: string;
  value: number;
  status: string;
}
