import { TransactionApprovedEvent } from 'src/modules/transaction/domain/transaction-approved.event';

import { TransactionApprovedEventMother } from './mothers/transaction-approved-event.mother';

describe('TransactionApprovedEvent test', () => {
  it('should be instantiated correctly', () => {
    const eventObject = TransactionApprovedEventMother.random().toPrimitives();
    expect(
      TransactionApprovedEvent.fromPrimitives({
        ...eventObject,
      }).toPrimitives(),
    ).toEqual(eventObject);
  });
});
