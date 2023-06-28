
export enum TransactionStatuses {
    Pending = "pending",
    Approved = "approved",
    Rejected = "rejected"
}

export enum TransactionType {
    Ordinary = 1,
    immediate = 2,
    Urgent = 3
}

export interface TransactionCreated {
    "transactionExternalId": string,
    "transactionType": {
        "name": number
    },
    "transactionStatus": {
        "name": string
    },
    "transactionValue": number,
    "createdAt": string
}