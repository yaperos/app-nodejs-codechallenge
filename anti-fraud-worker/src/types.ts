export enum EStatus {
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}

export enum ETypeEventTransaction {
    EVENT_TRANSACTION_APPROVED = "EVENT_TRANSACTION_APPROVED",
    EVENT_TRANSACTION_REJECTED = "EVENT_TRANSACTION_REJECTED"
}

export enum ETopicsTransaction {
    EVENT_NEW_TRANSACTION_FRAUD = "EVENT_NEW_TRANSACTION_FRAUD"
}

export interface IPayloadTransactionStatus {
    status: EStatus,
    id: string
}

export interface IPayloadBody {
    value: number,
    id: string
}

export interface IPayloadCall {
    event: ETypeEventTransaction,
    payload: IPayloadTransactionStatus
}