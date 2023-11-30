export class ICreateTransactionResponse {
    transactionExternalId: string;
    createdAt: string;
}

export class IRetriveTransactionResponse {
    transactionExternalId: string;
    transactionType: { name: string };
    transactionStatus: { name: string };
    value: number;
    createdAt: string;
}