export declare class Name {
    id: number;
    name: string;
}
export declare class CreateTransactionInput {
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    tranferTypeId: number;
    value: number;
    transactionExternalId: string;
    transactionType: string;
    transactionStatus: string;
}
