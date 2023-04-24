import { TransactionDto } from '../dto/transaction.dto';
import { EventAttributes, EventDomain } from '../../../config/bus/event.domain';

export class CreateAntiFraud extends EventDomain {
  readonly entityType: string = 'antiFraud';
  readonly topic = 'ANTI_FRAUD_KAFKA_TOPIC';

  constructor(protected transaction: TransactionDto, protected attributes: EventAttributes) {
    super(attributes?.eventId, attributes?.entityId, attributes?.commerce, attributes?.eventType, attributes?.channel);
  }

  getData(): Object {
    return { ...this.transaction };
  }
}
