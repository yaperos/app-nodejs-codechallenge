import { DomainEvent } from '@app/common';

export class TransactionStatusValidadedEvent extends DomainEvent {
  constructor(private id: string, private status: string) {
    super('transaction.status.validated');
  }

  toPrimitives() {
    return { id: this.id, status: this.status };
  }
}
