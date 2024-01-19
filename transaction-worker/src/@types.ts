export enum ETypeEventTransaction {
    EVENT_NEW_TRANSACTION_FRAUD = "EVENT_NEW_TRANSACTION_FRAUD"
}

export enum ETopicsTransaction {
    EVENT_NEW_TRANSACTION = "EVENT_NEW_TRANSACTION",
    EVENT_TRANSACTION_APPROVED = "EVENT_TRANSACTION_APPROVED",
    EVENT_TRANSACTION_REJECTED = "EVENT_TRANSACTION_REJECTED"
}

export enum EStatus {
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    PENDING = "PENDING"
}

export interface IPayloadTransactionStatus {
    status: EStatus,
    id: string
}

export interface BodyTransaction {
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    tranferTypeId: number;
    value: number;
}

export interface IPayloadBody {
    value: number,
    id: string
}