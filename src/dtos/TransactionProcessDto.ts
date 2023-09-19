export interface TransactionProcessDto{
    transactionExternalId: string;
    transactionType: DetailField;
    transactionStatus: DetailField;
    value:number;
    createdAt: string
}

export interface DetailField{
    name: string
}