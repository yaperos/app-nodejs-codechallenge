import { TransactionRejectedEvent } from 'src/modules/transaction/domain/events/transaction-rejected.event';

import { TransactionRejectedEventMother } from '../mothers/events/transaction-rejected-event.Mother';

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
