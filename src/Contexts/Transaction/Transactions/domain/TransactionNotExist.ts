export class TransactionNotExist extends Error {
	constructor() {
		super('The transaction does not exists');
	}
}
