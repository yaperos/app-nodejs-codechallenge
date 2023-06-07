export class CreateTransactionCommand {
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    tranferTypeId: number;
    value: number;
    createdAt: Date;
}