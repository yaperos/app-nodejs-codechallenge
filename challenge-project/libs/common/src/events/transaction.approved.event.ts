export interface TransactionApprovedEvent {
    transactionExternalId: string
    value: number
    approvedAt: Date
}