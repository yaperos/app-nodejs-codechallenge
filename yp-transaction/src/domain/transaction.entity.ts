export class TransactionStates{
    public static TRANSACTION_PENDING = 1;
    public static TRANSACTION_APPROVED = 2;
    public static TRANSACTION_REJECTED = 3;
}

export const TransactionStatesMap = {
    [TransactionStates.TRANSACTION_PENDING]: "Transfer Pending",
    [TransactionStates.TRANSACTION_APPROVED]: "Transfer Approved",
    [TransactionStates.TRANSACTION_REJECTED]: "Transfer Rejected",
};

export class TransactionTypes{
    public static TRANSACTION_DEPOSIT = 1;
    public static TRANSACTION_POS = 2;
    public static TRANSACTION_APP = 3;
}

export const TransactionTypesMap = {
    [TransactionTypes.TRANSACTION_DEPOSIT]: "Transfer from deposit",
    [TransactionTypes.TRANSACTION_POS]: "Transfer from pos",
    [TransactionTypes.TRANSACTION_APP]: "Transfer from app",
};

export default interface TransactionEntity {
    transactionExternalId?: string;
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    tranferTypeId: number;
    value: number;
    status?: number;
    createdAt?: string;
    createdAtTimestamp?: number;
    updatedAt?: string;
    updatedAtTimestamp?: number;
}