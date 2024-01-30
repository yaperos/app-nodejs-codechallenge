import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    MONGODB_URI: process.env.MONGODB_URI,
    KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID,
    KAFKA_BROKERS: process.env.KAFKA_BROKERS,
    KAFKA_CONSUMER_GROUPID: process.env.KAFKA_CONSUMER_GROUPID,
    KAFKA_TOPIC_NAME: process.env.KAFKA_TOPIC_NAME,
    KAFKA_VALID_TOPIC_NAME: process.env.KAFKA_VALID_TOPIC_NAME,
  };
});