export class AntiFraudEvent {
    constructor(
        public readonly transactionExternalId,
        public readonly transactionStatus,
        public readonly value
    ) { }

    toString() {
        return JSON.stringify({
            transactionExternalId: this.transactionExternalId,
            transactionStatus: this.transactionStatus,
            value: this.value
        });
    }
}