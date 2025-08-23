export interface CreateTransactionDto {
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    transferTypeId: string;
    value: number;
}
