/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { EventBus } from '../../../Shared/domain/EventBus';
import { TransactionId } from '../../../Transaction/Transactions/domain/TransactionId';
import { TransactionStatus } from '../../../Transaction/Transactions/domain/TransactionStatus';
import { TransactionValue } from '../../../Transaction/Transactions/domain/TransactionValue';
import { AntifraudTransactionValidator } from '../domain/AntifraudTransactionValidator';
import { InvalidTransactionValue } from '../domain/InvalidTransactionValue';

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
