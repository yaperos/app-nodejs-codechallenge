export class TransactionCreatedEvent {
    constructor(
        public readonly id: string,
        public readonly value: number
    ) {}
}