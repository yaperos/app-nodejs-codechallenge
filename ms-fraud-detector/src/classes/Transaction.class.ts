export class Transaction {
	constructor(
		private transactionId: string,
		private value: number
	) {}

	private validateAmount(): boolean {
		return this.value <= 1000;
	}

	public validateTransaction(): boolean {
		return [
			this.validateAmount()
		].every((approve: boolean) => approve);
	}

	public getTransactionID(): string {
		return this.transactionId;
	}

	public getValue(): number {
		return this.value;
	}
}