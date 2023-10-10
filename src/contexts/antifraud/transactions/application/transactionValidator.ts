import { EventBus } from '../../../shared/domain/eventBus';
import { TransactionId } from '../../../transaction/transactions/domain/transactionId';
import { TransactionStatus } from '../../../transaction/transactions/domain/transactionStatus';
import { TransactionValue } from '../../../transaction/transactions/domain/transactionValue';
import { AntifraudTransactionValidator } from '../domain/antifraudTransactionValidator';
import { InvalidTransactionValue } from '../domain/invalidTransactionValue';

export class TransactionValidator {
	constructor(private readonly eventBus: EventBus) {}

	async run(params: { id: string; value: number; status: string }) {
		const transactionId = new TransactionId(params.id);
		const transactionValue = new TransactionValue(params.value);
		const invalidTransactionValue = new InvalidTransactionValue();
		const transactionStatus = TransactionStatus.fromValue(params.status);
		const antifraudTransactionValidator = new AntifraudTransactionValidator(
			transactionId,
			transactionValue,
			invalidTransactionValue,
			transactionStatus
		);

		antifraudTransactionValidator.validate();
		await this.eventBus.publish(antifraudTransactionValidator.pullDomainEvents());
	}
}
