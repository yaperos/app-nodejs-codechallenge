import { DomainEvent } from '../../../Shared/domain/DomainEvent';

type ValidatedTransactionDomainEventAttributes = {
	readonly status: string;
};

export class TransactionValidatedDomainEvent extends DomainEvent {
	static readonly EVENT_NAME = 'antifraud.transaction.validated';

	readonly status: string;

	constructor({
		aggregateId,
		status,
		eventId,
		occurredOn
	}: {
		aggregateId: string;
		eventId?: string;
		status: string;
		occurredOn?: Date;
	}) {
		super({
			eventName: TransactionValidatedDomainEvent.EVENT_NAME,
			aggregateId,
			eventId,
			occurredOn
		});
		this.status = status;
	}

	static fromPrimitives(params: {
		aggregateId: string;
		attributes: ValidatedTransactionDomainEventAttributes;
		eventId: string;
		occurredOn: Date;
	}): DomainEvent {
		const { aggregateId, attributes, occurredOn, eventId } = params;

		return new TransactionValidatedDomainEvent({
			aggregateId,
			status: attributes.status,
			eventId,
			occurredOn
		});
	}

	toPrimitives(): ValidatedTransactionDomainEventAttributes {
		const { status } = this;

		return {
			status
		};
	}
}
