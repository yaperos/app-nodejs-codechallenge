import { env } from 'process';

export const envConstants = {
  KAFKA_NAME_MODULE: env.KAFKA_NAME_MODULE || 'transaction-microservice',
  KAFKA_BROKER: env.KAFKA_BROKER || 'localhost:9092',
  KAFKA_CLIENT_ID: env.KAFKA_CLIENT_ID || 'transaction',
  KAFKA_CONSUMER_GROUP_ID: env.KAFKA_CONSUMER_GROUP_ID || 'anti-fraud-consumer',
  KAFKA_PRODUCER_GROUP_ID:
    env.KAFKA_PRODUCER_GROUP_ID || 'transaction-consumer',
  EVENT_NAME_VALIDATE_TRANSACTION:
    env.EVENT_NAME_VALIDATE_TRANSACTION || 'validate-transaction',
};
