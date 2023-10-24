export class TransactionCreatedEvent {
    constructor(
        public readonly id: string,
        public readonly accountExternalIdDebit: string,
        public readonly accountExternalIdCredit: string,
        public readonly transferTypeId: number,
        public readonly value: number,
    ) { }
}