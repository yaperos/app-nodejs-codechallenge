/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Transaction } from '../domain/Transaction';

interface TransactionType {
	name: string;
}

interface TransactionStatus {
	name: string;
}

export class TransactionResponse {
	readonly transactionExternalId: string;
	readonly transactionType: TransactionType;
	readonly transactionStatus: TransactionStatus;
	readonly value: number;
	readonly createdAt: Date;

	constructor(transaction: Transaction) {
		const transactionPrimitives = transaction.toPrimitives();
		this.transactionExternalId = transactionPrimitives.id;
		this.transactionType = {
			name: transactionPrimitives.type
		};
		this.transactionStatus = {
			name: transactionPrimitives.status
		};
		this.value = transactionPrimitives.value;
		this.createdAt = transactionPrimitives.createdAt;
	}
}
