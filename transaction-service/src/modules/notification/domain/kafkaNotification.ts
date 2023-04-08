import { AggregateRoot, Result, UniqueEntityID } from 'clean-common-lib';
import { TransactionExternalResponseEvent } from './events';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface KafkaNotificationProps {
  id: string;
  isValid: boolean;
}

export class KafkaNotification extends AggregateRoot<KafkaNotificationProps> {
  public static create(
    props: KafkaNotificationProps,
    id?: UniqueEntityID
  ): Result<KafkaNotification> {
    const isNewKafkaNotification = !!id === false;

    const kafkaNotification = new KafkaNotification(props, id);

    if (isNewKafkaNotification) {
      kafkaNotification.addDomainEvent(
        new TransactionExternalResponseEvent(kafkaNotification)
      );
    }

    return Result.ok<KafkaNotification>(kafkaNotification);
  }
}
