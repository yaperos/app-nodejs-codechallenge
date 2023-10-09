import { TransactionId } from '../domain/transactionId';
import { TransactionRepository } from '../domain/transactionRepository';
import { TransactionStatus } from '../domain/transactionStatus';

export class TransactionStatusUpdater {
	constructor(private readonly transactionRepository: TransactionRepository) {}

	async run(params: { id: string; status: string }): Promise<void> {
		const transaction = await this.transactionRepository.search(new TransactionId(params.id));
		if (transaction) {
			const transactionUpdated = transaction.updateStatus(TransactionStatus.fromValue(params.status));
			await this.transactionRepository.save(transactionUpdated);
		}
	}
}
