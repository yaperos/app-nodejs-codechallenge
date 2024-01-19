import { TransactionCreatedEvent } from 'src/modules/transaction/domain/transaction-created.event';

import { TransactionCreatedEventMother } from './mothers/transaction-created-event.mother';

describe('TransactionCreatedEvent test', () => {
  it('should be instantiated correctly', () => {
    const eventObject = TransactionCreatedEventMother.random().toPrimitives();
    expect(
      TransactionCreatedEvent.fromPrimitives({ ...eventObject }).toPrimitives(),
    ).toEqual(eventObject);
  });
});
