import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    mongo: {
      dbName: process.env.MONGODB_DATABASE,
      host: process.env.MONGODB_HOST,
      port: parseInt(process.env.MONGODB_PORT,10),
      connection: process.env.MONGODB_CONNECTION,
    },
    KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID,
    KAFKA_BROKERS: process.env.KAFKA_BROKERS,
    KAFKA_CONSUMER_GROUPID: process.env.KAFKA_CONSUMER_GROUPID,
    KAFKA_VALID_TOPIC_NAME: process.env.KAFKA_VALID_TOPIC_NAME,
    KAFKA_TRANSACTIONS_TOPIC: process.env.KAFKA_TRANSACTIONS_TOPIC,
  };
});