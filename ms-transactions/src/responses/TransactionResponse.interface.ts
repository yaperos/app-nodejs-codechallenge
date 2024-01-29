export interface TransactionResponseInterface {
  transactionExternalId: string | undefined;
  transactionType: {
    name: string;
  };
  transactionStatus: {
    name: string;
  };
  value: number;
  createdAt: Date | undefined;
}
