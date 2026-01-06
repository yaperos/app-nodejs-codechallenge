export enum TransactionStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
}

export enum TransactionType {
    TRANSFER = 1,
    PAYMENT = 2,
    WITHDRAWAL = 3,
}

export const TransactionTypeNames: Record<TransactionType, string> = {
    [TransactionType.TRANSFER]: 'Transfer',
    [TransactionType.PAYMENT]: 'Payment',
    [TransactionType.WITHDRAWAL]: 'Withdrawal',
};
