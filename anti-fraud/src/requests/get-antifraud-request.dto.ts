
export class GetAntifraudRequest {
    constructor(
        public readonly transactionExternalId: string,
        public readonly accountExternalIdDebit: string,
        public readonly accountExternalIdCredit: string,
        public readonly tranferTypeId: number,
        public readonly transactionType: string,
        public readonly transactionStatus: string,
        public readonly value: number,
        public readonly createdAt: Date
    ) { }
    toString() {
        return JSON.stringify({
            transactionExternalId: this.transactionExternalId,
            transactionType: {
                name: this.transactionType
            },
            transactionStatus: {
                name: this.transactionStatus,
            },
            value: this.value,
            createdAt: this.createdAt
        })
    }
}

