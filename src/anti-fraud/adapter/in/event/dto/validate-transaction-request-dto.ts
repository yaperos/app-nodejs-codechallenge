export class ValidateTransactionRequestDto {
    traceabilityId: string;
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    transferTypeId: number;
    value: number;
}