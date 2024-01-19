export interface TransactionStatusDto {
    transactionExternalId: string;
    transactionStatus: {
      name: string;
    };
    transactionType: {
      name: string;
    };
    value: number;
    createdAt: string;
  }