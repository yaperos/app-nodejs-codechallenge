import { registerAs } from '@nestjs/config';

export default registerAs('kafka', () => ({
  KAFKA_HOST: process.env.KAFKA_HOST,
  KAFKA_PORT: process.env.KAFKA_PORT,
  KAFKA_GROUP_ID: process.env.KAFKA_GROUP_ID_ANTI_FRAUD,
  KAFKA_REQUEST_TIME_OUT: process.env.KAFKA_REQUEST_TIME_OUT,
}));
