export interface TransactionData {
    id: string;
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    transferTypeId: number;
    value: number;
    transactionStatusId: number;
    createdAt: Date;
}

export interface KafkaTransactionPayload {
    transactionId: string;
    value: number;
}

export interface KafkaEvaluationResponse {
    transactionId: string;
    status: 'approved' | 'rejected';
}

export type TransactionStatus = 'pending' | 'approved' | 'rejected';
