
export enum TransactionStatus {

    PENDING = 1,
    APPROVED = 2,
    REJECTED = 3

}

const transactionStatusLabel = new Map<TransactionStatus, string> ([
    [TransactionStatus.PENDING, 'PENDING'],
    [TransactionStatus.APPROVED, 'APPROVED'],
    [TransactionStatus.REJECTED, 'REJECTED']
])

export const getTransactionStatusLabel = (transactionStatus: TransactionStatus) => {
    return transactionStatusLabel.get(transactionStatus);
}