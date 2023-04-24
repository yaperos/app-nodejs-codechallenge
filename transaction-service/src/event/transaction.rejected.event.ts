export interface TransactionRejectedEvent {
    transactionExternalId: string
    value: number
    rejectedAt: Date
}