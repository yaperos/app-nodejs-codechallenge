import { Transaction } from '../domain/Transaction';
import { TransactionId } from '../domain/TransactionId';
import { TransactionNotExist } from '../domain/TransactionNotExist';
import { TransactionRepository } from '../domain/TransactionRepository';

export class TransactionFinder {
	constructor(private readonly transactionRepository: TransactionRepository) {}

	async run(params: { id: TransactionId }): Promise<Transaction> {
		const transaction = await this.transactionRepository.search(params.id);

		if (!transaction) {
			throw new TransactionNotExist();
		}

		return transaction;
	}
}
