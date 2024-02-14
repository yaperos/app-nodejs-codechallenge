export interface ITransaction {
  id: string;
  transferTypeId: number;
  value: number;
  status: string;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  createdAt: Date;
}

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
