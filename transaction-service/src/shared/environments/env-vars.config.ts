import { registerAs } from '@nestjs/config';
import * as process from 'process';

export default registerAs('config', () => {
  return {
    NODE_ENV: process.env.NODE_ENV,
    API_KEY: process.env.API_KEY,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_NAME: process.env.DB_NAME,
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    PORT: process.env.PORT,
    PREFIX: process.env.PREFIX,
    TIMEZONE: process.env.TIMEZONE,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
    REDIS_TIMEOUT: process.env.REDIS_TIMEOUT,
    KAFKA_HOST: process.env.KAFKA_HOST,
    KAFKA_PORT: process.env.KAFKA_PORT,
    KAFKA_TIMEOUT: process.env.KAFKA_TIMEOUT,
    KAFKA_RETRIES: process.env.KAFKA_RETRIES,
    KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID,
    TRANSACTION_TOPIC: process.env.TRANSACTION_TOPIC,
  };
});
