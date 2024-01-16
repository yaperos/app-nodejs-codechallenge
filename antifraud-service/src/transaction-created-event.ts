export class TransactionCreatedEvent {
    constructor(
        public readonly transactionId: string,
        public readonly accountExternalIdDebit: string,
        public readonly accountExternalIdCredit: string,
        public readonly transferTypeId: number,
        public readonly valueTransaction: number
    ) {}
}