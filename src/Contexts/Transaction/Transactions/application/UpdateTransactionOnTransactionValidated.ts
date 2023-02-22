import { TransactionValidatedDomainEvent } from '../../../AntiFraud/Transactions/domain/TransactionValidatedDomainEvent';
import { DomainEventClass } from '../../../Shared/domain/DomainEvent';
import { DomainEventSubscriber } from '../../../Shared/domain/DomainEventSubscriber';
import { TransactionStatusUpdater } from './TransactionStatusUpdater';
// import { TransactionValidator } from './TransactionValidator';

export class UpdateTransactionOnTransactionValidated
	implements DomainEventSubscriber<TransactionValidatedDomainEvent>
{
	constructor(private readonly statusUpdater: TransactionStatusUpdater) {}

	subscribedTo(): DomainEventClass[] {
		return [TransactionValidatedDomainEvent];
	}

	async on(domainEvent: TransactionValidatedDomainEvent): Promise<void> {
		const { aggregateId, status } = domainEvent;
		await this.statusUpdater.run({ id: aggregateId, status });
	}
}
