import { DomainEvent } from '../infraestructure/kafka/domain.event';

export interface EventBus {
  publish(event: DomainEvent): Promise<void>;
}
