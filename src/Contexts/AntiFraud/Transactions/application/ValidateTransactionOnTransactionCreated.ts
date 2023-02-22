import { DomainEventClass } from '../../../Shared/domain/DomainEvent';
import { DomainEventSubscriber } from '../../../Shared/domain/DomainEventSubscriber';
import { TransactionCreatedDomainEvent } from '../../../Transaction/Transactions/domain/TransactionCreatedDomainEvent';
import { TransactionValidator } from './TransactionValidator';

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
