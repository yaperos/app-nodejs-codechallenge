import { TransactionEntity } from "../entities/transaction.entity";

export class TransactionResponse {
    constructor(
        public readonly data: TransactionEntity
    ) { }

    toString() {
        return JSON.stringify({
            transactionExternalId: this.data.transactionExternalId,
            transactionType: {
                name: this.data.transactionType
            },
            transactionStatus: {
                name: this.data.status
            },
            value: this.data.value,
            createdAt: this.data.createdAt
        });
    }
}