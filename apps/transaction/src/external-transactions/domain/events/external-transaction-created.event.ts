import { DomainEvent } from '@app/common';

export class ExternalTransactionCreatedEvent extends DomainEvent {
  constructor(private id: string, private amount: number) {
    super('transaction.created');
  }

  toPrimitives() {
    return { id: this.id, amount: this.amount };
  }
}
