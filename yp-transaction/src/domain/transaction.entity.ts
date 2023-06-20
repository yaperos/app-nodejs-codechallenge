export enum TransactionStates{
    TRANSACTION_PENDING = 1,
    TRANSACTION_APPROVED = 2,
    TRANSACTION_REJECTED = 3
}

export default interface TransactionEntity {
    transactionExternalId: string;
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    tranferTypeId: number;
    value: number;
    status: number;
    createdAt: string;
    createdAtTimestamp: number;
    updatedAt: string;
    updatedAtTimestamp: number;
}