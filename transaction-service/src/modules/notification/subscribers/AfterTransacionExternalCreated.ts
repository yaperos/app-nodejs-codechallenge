import { DomainEvents, IHandle, IDomainEvent } from 'clean-common-lib';
import { TransactionExternalCreatedEvent } from '../../transactionExternal/domain';
import { NotifyKafka } from '../useCases/notifyKafka/NotifyKafka';

export class AfterTransactionExternalCreated
  implements IHandle<TransactionExternalCreatedEvent>
{
  private notifyKafka: NotifyKafka;

  constructor(notifyKafka: NotifyKafka) {
    this.setupSubscription();
    this.notifyKafka = notifyKafka;
  }

  setupSubscription(): void {
    DomainEvents.register(
      this.onTransactionExternalCreatedEvent.bind(this),
      TransactionExternalCreatedEvent.name
    );
  }

  private async onTransactionExternalCreatedEvent(
    event: IDomainEvent
  ): Promise<void> {
    const { transactionExternal } = event as TransactionExternalCreatedEvent;

    try {
      await this.notifyKafka.execute({
        topic: 'transaction-external',
        value: transactionExternal,
      });
    } catch (error) {
      console.log(error);
    }
  }
}
