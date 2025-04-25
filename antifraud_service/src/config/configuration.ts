import { Logger } from '@nestjs/common';
import { registerAs } from '@nestjs/config';

export default registerAs('app', () => {
  const env = {
    port: parseInt(process.env.ANTIFRAUD_SERVICE_PORT!, 10) || 3000,
    kafka: {
      broker: process.env.KAFKA_BROKER || 'localhost:9092',
      clientId: process.env.KAFKA_CLIENT_ID || 'antifraud-service-client-id',
      consumerGroupId: process.env.KAFKA_CONSUMER_GROUP_ID || 'antifraud-debezium-consumer-group',
    },
    antifraudThreshold: parseInt(process.env.ANTIFRAUD_THRESHOLD!, 10) || 1000,
  }
  Logger.log('Loaded configuration', env)
  return env
});