export class TransactionCreatedRequest {
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    transactionType: number;
    value: number;
    transactionExternalId?: string;
    status?: string;
    createdAt?: string;
}