import { registerAs } from '@nestjs/config';

/**
 * Kafka configuration reading from .env file
 */
export const kafkaConfig = registerAs('kafka', () => ({
  bootstrapServers: process.env.KAFKA_BOOTSTRAP_SERVERS?.split(',') || ['localhost:19092'],
  
  producer: {
    topic: process.env.KAFKA_PRODUCER_TOPIC || 'transaction-anti-fraud-validation',
  },
  
  consumer: {
    groupId: process.env.KAFKA_CONSUMER_GROUP_ID || 'reactive-group',
    fromBeginning: process.env.KAFKA_CONSUMER_FROM_BEGINNING === 'true' || false,
    autoCommit: process.env.KAFKA_CONSUMER_AUTO_COMMIT === 'true' || false,
    topic: process.env.KAFKA_CONSUMER_TOPIC || 'transaction-processing',
  },
}));


export default kafkaConfig;
