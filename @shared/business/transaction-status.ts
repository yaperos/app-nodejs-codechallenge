export enum TransactionStatus {
    APPROVED    =  1,
    PENDING     = 2,
    REJECTED    = 3,
}

export const transactionStatus = {
    1: 'approved',
    2: 'pending',
    3: 'rejected',
}

export const TransactionStatusAllowed = [
    TransactionStatus.APPROVED,
    TransactionStatus.PENDING,
    TransactionStatus.REJECTED,
];