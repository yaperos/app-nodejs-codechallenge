export interface RESOURCE_TRANSACTION {
    transactionExternalId: string,
    transactionType: {name: string},
    transactionStatus: {name: string},
    value: number,
    createdAt: Date
}