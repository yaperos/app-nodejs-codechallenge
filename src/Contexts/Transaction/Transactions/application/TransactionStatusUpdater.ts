import { TransactionId } from '../domain/TransactionId';
import { TransactionRepository } from '../domain/TransactionRepository';
import { TransactionStatus } from '../domain/TransactionStatus';

export class TransactionStatusUpdater {
	constructor(private readonly transactionRepository: TransactionRepository) {}

	async run(params: { id: string; status: string }): Promise<void> {
		const transaction = await this.transactionRepository.search(new TransactionId(params.id));
		if (transaction) {
			transaction.updateStatus(TransactionStatus.fromValue(params.status));
			await this.transactionRepository.save(transaction);
		}
	}
}
