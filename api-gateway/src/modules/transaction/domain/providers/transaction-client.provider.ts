export interface CreateTransactionInput {
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  tranferTypeId: number;
  value: number;
}

export interface TransactionOutput {
  transactionExternalId: string;
  transactionType: {
    name: string;
  };
  transactionStatus: {
    name: string;
  };
  value: number;
  createdAt: string;
}

export interface TransactionClientProvider {
  create(
    transactionCreateInput: CreateTransactionInput,
  ): Promise<TransactionOutput>;
  findOne(transactionExternalId: string): Promise<TransactionOutput>;
}

export const TRANSACTION_CLIENT_PROVIDER_ALIAS = Symbol(
  'TransactionClientProvider',
);
