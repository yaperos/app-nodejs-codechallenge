export class TransactionRejectedEvent {
    readonly status = "Rejected"
    transactionExternalId: string
    value: number
    rejectedAt = new Date()

    constructor(externalId: string, value: number) {
        this.transactionExternalId = externalId;
        this.value = value;
    }
}