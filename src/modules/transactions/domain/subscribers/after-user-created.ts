import { DomainEvents } from '../events/domain-events-handler';
import { TransactionCreated } from '../events/transaction-created';
import { IHandle } from '../interfaces/domain-handler';

export class AfterUserCreated implements IHandle<TransactionCreated> {
  constructor() {
    this.setupSubscriptions();
  }

  public setupSubscriptions(): void {
    DomainEvents.register(
      this.onUserCreatedEvent.bind(this),
      TransactionCreated.name,
    );
  }

  private async onUserCreatedEvent(event: TransactionCreated): Promise<void> {
    const { transaction } = event;
    console.log(`Transaction created with id ${transaction.id.toValue()}`);
  }
}
