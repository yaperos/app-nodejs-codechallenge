enum TransactionType {
    DEBIT = 'debit',
    CREDIT = 'credit',
}

enum TransactionStatus {
    APPROVED = 'approved',
    PENDING = 'pending',
    REJECTED = 'rejected',
}

export { TransactionType, TransactionStatus };
