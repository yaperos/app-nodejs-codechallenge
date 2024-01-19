export interface StatusDto {
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