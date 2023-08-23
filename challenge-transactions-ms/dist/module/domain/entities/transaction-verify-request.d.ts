export interface TransactionVerifyRequest {
    readonly accountExternalIdDebit: string;
    readonly accountExternalIdCredit: string;
    readonly transferTypeId: number;
    readonly value: number;
}
export interface TransactionVerifyUpdateRequest {
    readonly transactionExternalId: string;
    readonly status: string;
}
