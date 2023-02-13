export enum TransactionType {
    DEBIT    =  1,
    CREDIT     = 2,
}

export const transferTypes = [
    TransactionType.CREDIT, 
    TransactionType.DEBIT
];

export const transferTypeName = {
    1: 'debit',
    2: 'credit',
}