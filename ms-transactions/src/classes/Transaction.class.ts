export class Transaction {
	constructor(
		private transactionId: string,
		private value: number
	) {}

	public getTransactionID(): string {
		return this.transactionId;
	}

	public getValue(): number {
		return this.value;
	}
}