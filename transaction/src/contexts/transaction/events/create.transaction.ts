import { TransactionDto } from '../dto/transaction.dto';
import { EventAttributes, EventDomain } from '@/config/bus/event.domain';

export class CreateTransaction extends EventDomain {
  readonly entityType: string = 'transaction';
  readonly eventType: string = 'created';
  readonly topic = 'KAFKA_TOPIC';

  constructor(protected transaction: TransactionDto, protected attributes: EventAttributes) {
    super(attributes?.eventId, attributes?.entityId, attributes?.commerce, attributes?.channel);
  }

  getData(): Object {
    return { ...this.transaction };
  }
}
