import { Logger } from '@nestjs/common';
import { registerAs } from '@nestjs/config';

export default registerAs('app', () => {
  const env = {
    port: parseInt(process.env.TRANSACTION_SERVICE_PORT!, 10) || 3000,
    database: {
      url: process.env.DATABASE_URL,
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT!, 10) || 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
    },
    kafka: {
      broker: process.env.KAFKA_BROKER || 'localhost:9092',
      clientId: process.env.KAFKA_CLIENT_ID || 'transaction-service',
      consumerGroupId: process.env.KAFKA_CONSUMER_GROUP_ID || 'transaction-service-group',
    },
  }
  Logger.log('Loaded configuration', env)
  return env
});