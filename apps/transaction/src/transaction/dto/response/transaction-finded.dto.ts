export class TransactionFindeddDto {

    transactionExternalId: string;
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    tranferTypeId: number;
    amount: number;
    status: number;
    createdAt: Date;
    updatedAt: Date;
}