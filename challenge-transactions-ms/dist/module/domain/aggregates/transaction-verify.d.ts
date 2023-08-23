export declare class TransactionVerify {
    readonly transactionExternalId: string;
    readonly accountExternalIdDebit: string;
    readonly accountExternalIdCredit: string;
    readonly transactionType: TransactionVerifyType;
    readonly value: number;
    readonly transactionStatus: TransactionVerifyStatus;
    readonly createdAt: Date;
    readonly updatedAtStatus: Date;
    constructor(transactionExternalId: string, accountExternalIdDebit: string, accountExternalIdCredit: string, transactionType: TransactionVerifyType, value: number, transactionStatus: TransactionVerifyStatus, createdAt: Date, updatedAtStatus: Date);
}
export declare class TransactionVerifyType {
    readonly id: number;
    readonly name: string;
    constructor(id: number, name: string);
}
export declare class TransactionVerifyStatus {
    readonly id: number;
    readonly name: string;
    constructor(id: number, name: string);
}
