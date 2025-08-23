export class MessageTransactionModel {
    constructor(
        public readonly transactionExternalId: string,
        public readonly value: number
    ) {}
}
