declare class TransactionType {
    readonly name: string;
    readonly id: number;
}
declare class TransactionStatus {
    readonly name: string;
    readonly id: number;
}
declare class ResponseTransactionVerify {
    readonly transactionExternalId: string;
    readonly accountExternalIdDebit: string;
    readonly accountExternalIdCredit: string;
    readonly value: number;
    readonly transactionType: TransactionType;
    readonly transactionStatus: TransactionStatus;
    readonly createdAt: string;
    readonly updatedAtStatus: string;
}
export declare class TransactionVerifyResponseDto {
    data: ResponseTransactionVerify;
    message: string;
}
export {};
