export class TransactionType {
    constructor(
        public readonly id: number,
        public readonly name: string,
    ) {}

    static create(id: number): TransactionType {
        const types: Record<number, string> = {
            1: 'Transfer',
            2: 'Payment',
            3: 'Withdrawal',
        };

        return new TransactionType(id, types[id] || 'Unknown');
    }
}
