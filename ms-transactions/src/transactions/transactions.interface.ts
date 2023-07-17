export interface FormattedTransaction {
    transactionExternalId: string;
    transactionType: {
      name: number;
    };
    transactionStatus: {
      name: string;
    };
    value: number;
    createdAt: Date;
}