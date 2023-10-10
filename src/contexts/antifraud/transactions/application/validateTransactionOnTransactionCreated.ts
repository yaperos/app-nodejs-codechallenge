import { DomainEventClass } from '../../../shared/domain/domainEvent';
import { DomainEventSubscriber } from '../../../shared/domain/domainEventSubscriber';
import { TransactionCreatedDomainEvent } from '../../../transaction/transactions/domain/transactionCreatedDomainEvent';
import { TransactionValidator } from './transactionValidator';

export class CreateTransactionOnTransactionCreated
	implements DomainEventSubscriber<TransactionCreatedDomainEvent>
{
	constructor(private readonly validator: TransactionValidator) {}

	subscribedTo(): DomainEventClass[] {
		return [TransactionCreatedDomainEvent];
	}

	async on(domainEvent: TransactionCreatedDomainEvent): Promise<void> {
		const { aggregateId, value, status } = domainEvent;

		await this.validator.run({ id: aggregateId, value, status });
	}
}
