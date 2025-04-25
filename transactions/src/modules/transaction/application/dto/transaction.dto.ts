export interface TransactionDto {
  transactionExternalId: string;
  transactionType: {
    name: number;
  };
  value: number;
  createdAt: Date;
  transactionStatus: {
    name: string;
  };
}
