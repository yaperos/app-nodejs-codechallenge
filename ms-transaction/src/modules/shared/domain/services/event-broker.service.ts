import { Inject } from '@nestjs/common';
import {
  BROKER_PROVIDER_ALIAS,
  BrokerProvider,
} from 'src/modules/shared/domain/providers/broker.provider';

import { DomainEvent } from '../domain-event';

export class EventBrokerService {
  constructor(
    @Inject(BROKER_PROVIDER_ALIAS)
    private readonly brokerProvider: BrokerProvider,
  ) {}

  async publish(events: DomainEvent<any>[]): Promise<void> {
    for (const event of events) {
      await this.brokerProvider.publishEvent(event);
    }
  }
}
