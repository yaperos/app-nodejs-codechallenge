export interface ITransactionStatusPublisher {
    publish(transactionId: string, status: 'approved' | 'rejected'): void;
}
