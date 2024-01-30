export class TransactionCreatedEvent {
    constructor(
        public readonly transactionId: string,
        public readonly status: string,
        public readonly transferTypeName: string,
        public readonly value: number,
        public readonly createdAt: Date
    ) { }
}
