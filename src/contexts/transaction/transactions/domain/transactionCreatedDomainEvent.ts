import { DomainEvent } from '../../../shared/domain/domainEvent';

type CreateTransactionDomainEventAttributes = {
	readonly value: number;
	readonly status: string;
};

export class TransactionCreatedDomainEvent extends DomainEvent {
	static readonly EVENT_NAME = 'transaction.transaction.created';

	readonly value: number;
	readonly status: string;

	constructor({
		aggregateId,
		value,
		eventId,
		status,
		occurredOn
	}: {
		aggregateId: string;
		eventId?: string;
		value: number;
		status: string;
		occurredOn?: Date;
	}) {
		super({
			eventName: TransactionCreatedDomainEvent.EVENT_NAME,
			aggregateId,
			eventId,
			occurredOn
		});
		this.value = value;
		this.status = status;
	}

	static fromPrimitives(params: {
		aggregateId: string;
		attributes: CreateTransactionDomainEventAttributes;
		eventId: string;
		occurredOn: Date;
	}): DomainEvent {
		const { aggregateId, attributes, occurredOn, eventId } = params;

		return new TransactionCreatedDomainEvent({
			aggregateId,
			value: attributes.value,
			status: attributes.status,
			eventId,
			occurredOn
		});
	}

	toPrimitives(): CreateTransactionDomainEventAttributes {
		const { value, status } = this;

		return {
			value,
			status
		};
	}
}
