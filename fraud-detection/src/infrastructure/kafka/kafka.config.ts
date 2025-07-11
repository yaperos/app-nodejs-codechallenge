export interface KafkaConfig {
  clientId: string;
  brokers: string[];
  groupId: string;
}

export const getKafkaConfig = (serviceName: string): KafkaConfig => ({
  clientId: serviceName,
  brokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'],
  groupId: `${serviceName}-group`,
});

export const KAFKA_PATTERNS = {
  TRANSACTION_CREATED: 'transaction.created',
  TRANSACTION_STATUS_UPDATED: 'transaction.status.updated',
} as const;
