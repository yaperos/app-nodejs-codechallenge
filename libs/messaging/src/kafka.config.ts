export interface KafkaOptions {
  clientId: string;
  brokers: string[];
}

export const KAFKA_OPTIONS = Symbol('KAFKA_OPTIONS');
