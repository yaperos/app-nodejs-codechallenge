export interface ResponseLastTransaction {
    transactionExternalId: string;
    transactionType: TransactionTypeResponse;
    transactionStatus: TransactionStatus;
    value: number;
    createdAt: Date;
}

interface TransactionTypeResponse{
    name:string
}

interface TransactionStatus{
    name:string
}