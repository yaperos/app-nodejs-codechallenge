import { Transaction } from '../domain/transaction';
import { TransactionId } from '../domain/transactionId';
import { TransactionNotExist } from '../domain/transactionNotExist';
import { TransactionRepository } from '../domain/transactionRepository';

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
