export class TransactionEvent {

    constructor(transactionExternalId: string, value: number) {
        this.transactionExternalId = transactionExternalId;
        this.value = value;
    }

    transactionExternalId: string;
    value: number; 

    toJson() {
        return JSON.stringify({
            transactionExternalId: this.transactionExternalId,
            value: this.value,
        });
    }
}