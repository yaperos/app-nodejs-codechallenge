export interface StatusObjectI {
    id: number,
    transactionId: number
    status: string,
    createdAt: Date,
}

export interface UpdateTransactionI {
    id: number
    statusArray: string,
}