export class TransactionApprovedEvent {
    readonly status = "Approved"
    transactionExternalId: string
    value: number
    approvedAt = new Date()

    constructor(externalId: string, value: number) {
        this.transactionExternalId = externalId;
        this.value = value;
    }
}