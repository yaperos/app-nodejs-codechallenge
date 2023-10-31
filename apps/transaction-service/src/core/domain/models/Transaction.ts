export type Transaction = {
  id: string;
  externalId: string;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  transactionType: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TransactionTypeOutput = {
  name: string;
};

export type TransactionStatusOutput = {
  name: string;
};

export type TransactionOutput = {
  transactionExternalId: string;
  transactionType: TransactionTypeOutput;
  transactionStatus: TransactionStatusOutput;
  value: number;
  createdAt: Date;
};
