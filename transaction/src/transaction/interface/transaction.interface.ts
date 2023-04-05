export interface ITransaction {
  transactionExternalId: string;
  transactionType: {
    name: number;
  };
  transactionStatus: {
    name: number;
  };
  value: number;
  createdAt: Date;
}
