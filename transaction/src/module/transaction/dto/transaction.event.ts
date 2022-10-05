export class TransactionEvent {
    constructor(
        public readonly transactionExternalId,
        public readonly value
    ) { }

    toString() {
        return JSON.stringify({
            transactionExternalId: this.transactionExternalId,
            value: this.value
        });
    }
}