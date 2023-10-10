import { TransactionValidatedDomainEvent } from '../../../antifraud/transactions/domain/transactionValidatedDomainEvent';
import { DomainEventClass } from '../../../shared/domain/domainEvent';
import { DomainEventSubscriber } from '../../../shared/domain/domainEventSubscriber';
import { TransactionStatusUpdater } from './transactionStatusUpdater';

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
