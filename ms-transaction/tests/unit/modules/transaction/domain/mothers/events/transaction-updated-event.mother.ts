import { TransactionUpdatedEvent } from 'src/modules/transaction/domain/events/transaction-updated.event';
import {
  DateMother,
  UuidMother,
} from 'tests/unit/modules/shared/domain/mothers';

import { TransactionIdMother } from '../transaction-id.mother';

export class TransactionUpdatedEventMother {
  static create({
    id = UuidMother.random(),
    aggregateId = TransactionIdMother.randomValue(),
    occurredOn = DateMother.random(),
  }: {
    id?: string;
    aggregateId?: string;
    occurredOn?: Date;
  }): TransactionUpdatedEvent {
    return TransactionUpdatedEvent.fromPrimitives({
      id,
      aggregateId,
      occurredOn,
      attributes: {},
    });
  }

  static random(): TransactionUpdatedEvent {
    return new TransactionUpdatedEvent({
      aggregateId: TransactionIdMother.randomValue(),
    });
  }
}
