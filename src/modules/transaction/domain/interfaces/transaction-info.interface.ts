export interface ITransactionInfo {
    transactionExternalId: number;
    transactionType: {
        name: string;
    };
    transactionStatus: {
        name: string;
    };
    value: number;
    createdAt: Date;
}