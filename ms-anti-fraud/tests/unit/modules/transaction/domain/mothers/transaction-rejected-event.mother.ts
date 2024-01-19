import { TransactionRejectedEvent } from 'src/modules/transaction/domain/transaction-rejected.event';
import {
  DateMother,
  UuidMother,
} from 'tests/unit/modules/shared/domain/mothers';

import { TransactionIdMother } from './transaction-id.mother';

export class TransactionRejectedEventMother {
  static create({
    id = UuidMother.random(),
    aggregateId = TransactionIdMother.randomValue(),
    occurredOn = DateMother.random(),
  }: {
    id?: string;
    aggregateId?: string;
    occurredOn?: Date;
  }): TransactionRejectedEvent {
    return TransactionRejectedEvent.fromPrimitives({
      id,
      aggregateId,
      occurredOn,
      attributes: {},
    });
  }

  static random(): TransactionRejectedEvent {
    return new TransactionRejectedEvent({
      aggregateId: TransactionIdMother.randomValue(),
    });
  }
}
