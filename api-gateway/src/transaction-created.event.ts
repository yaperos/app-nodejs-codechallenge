export class TransactionCreatedEvent {
    constructor(
        public readonly transactionId: string,
        public readonly value: number
    ) {}


    // toString() {
    //     return JSON.stringify({
    //         "transactionId": this.transactionId,
    //         "value": this.value
    //     })
    // }
}