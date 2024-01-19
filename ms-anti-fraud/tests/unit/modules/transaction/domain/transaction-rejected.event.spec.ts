import { TransactionRejectedEvent } from 'src/modules/transaction/domain/transaction-rejected.event';

import { TransactionRejectedEventMother } from './mothers/transaction-rejected-event.mother';

describe('TransactionRejectedEvent test', () => {
  it('should be instantiated correctly', () => {
    const eventObject = TransactionRejectedEventMother.random().toPrimitives();
    expect(
      TransactionRejectedEvent.fromPrimitives({
        ...eventObject,
      }).toPrimitives(),
    ).toEqual(eventObject);
  });
});
