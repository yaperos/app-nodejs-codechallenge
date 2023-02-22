/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { AggregateRoot } from '../../../Shared/domain/AggregateRoot';
import { TransactionId } from '../../../Transaction/Transactions/domain/TransactionId';
import {
	TransactionStatus,
	TransactionStatuses
} from '../../../Transaction/Transactions/domain/TransactionStatus';
import { TransactionValue } from '../../../Transaction/Transactions/domain/TransactionValue';
import { InvalidTransactionValue } from './InvalidTransactionValue';
import { TransactionValidatedDomainEvent } from './TransactionValidatedDomainEvent';

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
