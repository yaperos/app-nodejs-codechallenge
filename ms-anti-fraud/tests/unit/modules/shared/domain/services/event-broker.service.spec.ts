import { EventBrokerService } from 'src/modules/shared/domain/services/event-broker.service';

import { IntegerMother, StringMother, UuidMother } from '../mothers';
import { MockBrokerProvider } from '../providers/mock-broker.provider';
import { TestedDomainEvent } from '../tested-domain.event';

describe('EventBrokerService test', () => {
  const brokerProvider: MockBrokerProvider = new MockBrokerProvider();
  const eventBrokerService: EventBrokerService = new EventBrokerService(
    brokerProvider,
  );

  it('should be test publish function', async () => {
    const event = new TestedDomainEvent({
      aggregateId: UuidMother.random(),
      fieldString: StringMother.random(),
      fieldInteger: IntegerMother.random(),
    });

    const event2 = new TestedDomainEvent({
      aggregateId: UuidMother.random(),
      fieldString: StringMother.random(),
      fieldInteger: IntegerMother.random(),
    });
    await eventBrokerService.publish([event, event2]);
    brokerProvider.assertPublishEventHasBeenCalledWith(event);
    brokerProvider.assertPublishEventHasBeenCalledWith(event2);
  });
});
