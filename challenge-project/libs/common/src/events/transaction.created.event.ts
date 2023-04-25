export interface TransactionCreatedEvent {
    transactionExternalId: string
    value: number
    createdAt: Date
}