import { TransactionCreatedEvent } from 'src/modules/transaction/domain/events/transaction-created.event';

import { TransactionCreatedEventMother } from '../mothers/events/transaction-created-event.mother';

describe('TransactionCreatedEvent test', () => {
  it('should be instantiated correctly', () => {
    const eventObject = TransactionCreatedEventMother.random().toPrimitives();
    expect(
      TransactionCreatedEvent.fromPrimitives({ ...eventObject }).toPrimitives(),
    ).toEqual(eventObject);
  });
});
