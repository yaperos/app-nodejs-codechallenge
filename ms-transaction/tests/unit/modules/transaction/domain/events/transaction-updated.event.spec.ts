import { TransactionUpdatedEvent } from 'src/modules/transaction/domain/events/transaction-updated.event';

import { TransactionUpdatedEventMother } from '../mothers/events/transaction-updated-event.mother';

describe('TransactionUpdatedEvent test', () => {
  it('should be instantiated correctly', () => {
    const eventObject = TransactionUpdatedEventMother.random().toPrimitives();
    expect(
      TransactionUpdatedEvent.fromPrimitives({
        ...eventObject,
      }).toPrimitives(),
    ).toEqual(eventObject);
  });
});
