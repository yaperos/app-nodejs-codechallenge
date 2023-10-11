export class CreateTransactionRequest {
    public accountExternalIdDebit: string;
    public accountExternalIdCredit: string;
    public tranferTypeId: number;
    public value: number;
}