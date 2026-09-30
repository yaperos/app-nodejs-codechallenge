export type FraudStatus = 'approved' | 'rejected';

export interface TransactionToEvaluate {
    transactionId: string;
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    transferTypeId: number;
    value: number;
}

export interface FraudEvaluation {
    sourceEventId: string;
    transactionId: string;
    status: FraudStatus;
    reasons: string[];
}