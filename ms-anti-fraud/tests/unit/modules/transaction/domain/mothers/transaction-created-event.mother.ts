import { TransactionCreatedEvent } from 'src/modules/transaction/domain/transaction-created.event';
import {
  DateMother,
  UuidMother,
} from 'tests/unit/modules/shared/domain/mothers';

import { TransactionAmountMother } from './transaction-amount.Mother';
import { TransactionIdMother } from './transaction-id.Mother';

export class TransactionCreatedEventMother {
  static create({
    id = UuidMother.random(),
    aggregateId = TransactionIdMother.randomValue(),
    occurredOn = DateMother.random(),
    amount = TransactionAmountMother.randomValue(),
  }: {
    id?: string;
    aggregateId?: string;
    occurredOn?: Date;
    amount?: number;
  }): TransactionCreatedEvent {
    return TransactionCreatedEvent.fromPrimitives({
      id,
      aggregateId,
      occurredOn,
      attributes: {
        amount,
      },
    });
  }

  static random(): TransactionCreatedEvent {
    return new TransactionCreatedEvent({
      aggregateId: TransactionIdMother.randomValue(),
      amount: TransactionAmountMother.randomValue(),
    });
  }
}
