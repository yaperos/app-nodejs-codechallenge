export class Transaction {
    constructor(
        public readonly id: string,
        public readonly value: number
    ) {}

    isApproved(): boolean {
        return this.value <= 1000; 
    }
}
