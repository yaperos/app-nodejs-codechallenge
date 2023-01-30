export class TransactionModel{
    id! :number;
    externalId!: string;
    accountExternalIdDebit!: string;
    accountExternalIdCredit!: string;
    transferTypeId!: number;
    value!: number;
    statusId!: number;
    createdAt!: Date;
    updatedAt: Date;
}