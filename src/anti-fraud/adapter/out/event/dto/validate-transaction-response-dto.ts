export class ValidateTransactionResponseDto {
    traceabilityId: string;
    transactionStatus: string;
}

export enum TransactionStatus {
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED'
}