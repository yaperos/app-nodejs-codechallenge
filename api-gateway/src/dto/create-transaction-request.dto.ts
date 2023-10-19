export class CreateTransactionRequest {
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    tranferTypeId: string;
    value: number;
    status?: string;
}