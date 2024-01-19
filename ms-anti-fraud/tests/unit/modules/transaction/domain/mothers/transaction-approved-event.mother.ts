import { TransactionApprovedEvent } from 'src/modules/transaction/domain/transaction-approved.event';
import {
  DateMother,
  UuidMother,
} from 'tests/unit/modules/shared/domain/mothers';

import { TransactionIdMother } from './transaction-id.mother';

export class TransactionApprovedEventMother {
  static create({
    id = UuidMother.random(),
    aggregateId = TransactionIdMother.randomValue(),
    occurredOn = DateMother.random(),
  }: {
    id?: string;
    aggregateId?: string;
    occurredOn?: Date;
  }): TransactionApprovedEvent {
    return TransactionApprovedEvent.fromPrimitives({
      id,
      aggregateId,
      occurredOn,
      attributes: {},
    });
  }

  static random(): TransactionApprovedEvent {
    return new TransactionApprovedEvent({
      aggregateId: TransactionIdMother.randomValue(),
    });
  }
}
