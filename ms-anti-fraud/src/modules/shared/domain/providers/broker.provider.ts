import { DomainEvent } from '../domain-event';

export const BROKER_PROVIDER_ALIAS = Symbol('BrokerProvider');

export interface BrokerProvider {
  publishEvent(event: DomainEvent<any>): Promise<void>;
}

export const KAFKA_BROKER = Symbol('KafkaBroker');
