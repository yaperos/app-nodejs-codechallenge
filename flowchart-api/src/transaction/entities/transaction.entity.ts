export enum TransactionStatus {
    Approved = 2,
    Pending = 1,
    Rejected = 3,


}

export class Transaction {
    id?: number
    value: number;
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    statusId: number;
    transferTypeId: number;
}
