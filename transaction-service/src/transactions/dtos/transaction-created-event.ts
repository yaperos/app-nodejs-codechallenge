export class TransactionCreatedEvent {
    constructor(
        public readonly transactionId: string,
        public readonly accountExternalIdDebit: string,
        public readonly accountExternalIdCredit: string,
        public readonly transferTypeId: number,
        public readonly valueTransaction: number
    ) {}

    toString() {
        return JSON.stringify({
            transactionId: this.transactionId,
            accountExternalIdDebit: this.accountExternalIdDebit,
            accountExternalIdCredit: this.accountExternalIdCredit,
            transferTypeId: this.transferTypeId,
            valueTransaction: this.valueTransaction
        })
    }

}