export class Transaction {
    constructor(
        public readonly id: string,
        public readonly accountExternalIdDebit: string,
        public readonly accountExternalIdCredit: string,
        public readonly transferTypeId: string,
        public readonly transferTypeName: string,
        public readonly value: number,
        public status: string,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) {}
}
