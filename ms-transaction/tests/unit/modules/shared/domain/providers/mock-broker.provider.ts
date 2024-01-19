import { DomainEvent } from 'src/modules/shared/domain/domain-event';
import { BrokerProvider } from 'src/modules/shared/domain/providers/broker.provider';

export class MockBrokerProvider implements BrokerProvider {
  private mockPublishEvent = jest.fn();

  async publishEvent(event: DomainEvent<any>): Promise<void> {
    this.mockPublishEvent(event);
  }

  assertPublishEventHasBeenCalledWith(event: DomainEvent<any>) {
    expect(this.mockPublishEvent).toHaveBeenCalledWith(event);
  }
}
