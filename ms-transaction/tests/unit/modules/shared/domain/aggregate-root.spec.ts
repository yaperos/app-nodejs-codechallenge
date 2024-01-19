import { IntegerMother, StringMother, UuidMother } from './mothers';
import { Test } from './test';
import { TestedDomainEvent } from './tested-domain.event';

describe('AggregateRoot test', () => {
  it('should be correctly instance', () => {
    const id = UuidMother.random();
    const aggregate = new Test(id);

    expect(aggregate.getId()).toEqual(id);
  });

  it('should record domain event', () => {
    const aggregate = new Test(UuidMother.random());
    expect(aggregate.pullDomainEvents()).toEqual([]);

    const event = new TestedDomainEvent({
      aggregateId: UuidMother.random(),
      fieldString: StringMother.random(),
      fieldInteger: IntegerMother.random(),
    });
    aggregate.recordEvent(event);
    expect(aggregate.pullDomainEvents()).toEqual([event]);
  });
});
