import { registerAs } from '@nestjs/config';

/**
 * Kafka configuration reading from .env file
 */
export const kafkaConfig = registerAs('kafka', () => ({
  bootstrapServers: process.env.KAFKA_BOOTSTRAP_SERVERS?.split(',') || ['kafka:29092'],
  
  producer: {
    topic: process.env.KAFKA_PRODUCER_TOPIC || 'transaction-processing',
  },
  
  consumer: {
    groupId: process.env.KAFKA_CONSUMER_GROUP_ID || 'reactive-group-01',
    fromBeginning: process.env.KAFKA_CONSUMER_FROM_BEGINNING === 'true' || false,
    autoCommit: process.env.KAFKA_CONSUMER_AUTO_COMMIT === 'true' || false,
    topic: process.env.KAFKA_CONSUMER_TOPIC || 'transaction-anti-fraud-validation',
  },
}));

/**
 * Application configuration reading from .env file
 */
export const applicationConfig = registerAs('application', () => ({
  name: process.env.APP_NAME || 'business-transaction-anti-fraud',

  server: {
    port: parseInt(process.env.APP_PORT || '8082', 10),
    basePath: process.env.APP_BASE_PATH || '/transaction-anti-fraud/v1',
  },
  
  maximumTransactionAmount: parseFloat(process.env.APP_MAXIMUM_TRANSACTION_AMOUNT || '1000'),
}));

export default kafkaConfig;
