import { registerAs } from '@nestjs/config';
import * as process from 'process';

export default registerAs('config', () => {
  return {
    NODE_ENV: process.env.NODE_ENV,
    API_KEY: process.env.API_KEY,
    APP_NAME: process.env.APP_NAME,
    TIMEZONE: process.env.TIMEZONE,
    KAFKA_HOST: process.env.KAFKA_HOST,
    KAFKA_PORT: process.env.KAFKA_PORT,
    KAFKA_TIMEOUT: process.env.KAFKA_TIMEOUT,
    KAFKA_RETRIES: process.env.KAFKA_RETRIES,
    KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID,
    KAFKA_GROUP_ID: process.env.KAFKA_GROUP_ID,
    TRANSACTION_TOPIC: process.env.TRANSACTION_TOPIC,
    TRANSACTION_EVALUATED_TOPIC: process.env.TRANSACTION_EVALUATED_TOPIC,
  };
});
