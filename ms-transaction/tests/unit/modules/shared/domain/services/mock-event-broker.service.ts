import { DomainEvent } from 'src/modules/shared/domain/domain-event';
import { BrokerProvider } from 'src/modules/shared/domain/providers/broker.provider';
import { EventBrokerService } from 'src/modules/shared/domain/services/event-broker.service';

export class MockEventBrokerService extends EventBrokerService {
  private mockPublish = jest.fn();

  constructor() {
    const brokerProvider: Partial<BrokerProvider> = {};
    super(brokerProvider as BrokerProvider);
  }

  async publish(events: DomainEvent<any>[]): Promise<void> {
    this.mockPublish(events);
  }

  assertPublishHasBeenCalledWith(events: DomainEvent<any>[]) {
    expect(this.mockPublish).toHaveBeenCalledWith(events);
  }

  assertNotPublishCalled() {
    expect(this.mockPublish).toHaveBeenCalledTimes(0);
  }
}
