import { IntegerMother, StringMother, UuidMother } from './mothers';
import { TestedDomainEvent } from './tested-domain.event';

describe('DomainEvent test', () => {
  it('should be correctly instance', () => {
    const id = UuidMother.random();
    const aggregateId = UuidMother.random();
    const occurredOn = new Date();
    const fieldString = StringMother.random();
    const fieldInteger = IntegerMother.random();

    const eventValues = {
      id,
      aggregateId,
      occurredOn,
      attributes: { fieldString, fieldInteger },
    };

    const event = TestedDomainEvent.fromPrimitives(eventValues);
    expect(event.toPrimitives()).toEqual(eventValues);
  });

  it('should test toJSON function', () => {
    const event = new TestedDomainEvent({
      aggregateId: UuidMother.random(),
      fieldString: StringMother.random(),
      fieldInteger: IntegerMother.random(),
    });

    expect(event.toJSON()).toEqual({
      type: event.eventName,
      ...event.toPrimitives(),
    });
  });
});
