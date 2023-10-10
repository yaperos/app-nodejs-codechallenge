import { AggregateRoot } from '../../../shared/domain/aggregateRoot';
import { TransactionId } from '../../../transaction/transactions/domain/transactionId';
import {
	TransactionStatus,
	TransactionStatuses
} from '../../../transaction/transactions/domain/transactionStatus';
import { TransactionValue } from '../../../transaction/transactions/domain/transactionValue';
import { InvalidTransactionValue } from './invalidTransactionValue';
import { TransactionValidatedDomainEvent } from './transactionValidatedDomainEvent';

export class AntifraudTransactionValidator extends AggregateRoot {
	readonly transactionId: TransactionId;
	readonly transactionValue: TransactionValue;
	readonly invalidTransactionValue: InvalidTransactionValue;
	transactionStatus: TransactionStatus;

	constructor(
		transactionId: TransactionId,
		transactionValue: TransactionValue,
		invalidTransactionValue: InvalidTransactionValue,
		transactionStatus: TransactionStatus
	) {
		super();
		this.transactionId = transactionId;
		this.transactionValue = transactionValue;
		this.transactionStatus = transactionStatus;
		this.invalidTransactionValue = invalidTransactionValue;
	}

	static fromPrimitives(data: {
		transactionId: string;
		transactionValue: number;
		transactionStatus: string;
	}): AntifraudTransactionValidator {
		return new AntifraudTransactionValidator(
			new TransactionId(data.transactionId),
			new TransactionValue(data.transactionValue),
			new InvalidTransactionValue(),
			TransactionStatus.fromValue(data.transactionStatus)
		);
	}

	validate(): TransactionStatus {
		this.transactionStatus = new TransactionStatus(
			this.transactionValue.isBiggerThan(this.invalidTransactionValue)
				? TransactionStatuses.REJECTED
				: TransactionStatuses.APPROVED
		);
		this.record(
			new TransactionValidatedDomainEvent({
				aggregateId: this.transactionId.value,
				status: this.transactionStatus.value
			})
		);

		return this.transactionStatus;
	}

	toPrimitives() {
		return {
			transactionId: this.transactionId.value,
			transactionValue: this.transactionValue.value,
			transactionStatus: this.transactionStatus.value,
			invalidTransactionValue: this.invalidTransactionValue.value
		};
	}
}
