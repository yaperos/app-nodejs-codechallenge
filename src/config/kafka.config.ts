import { registerAs } from '@nestjs/config';

export default registerAs('kafka', () => ({
  port: process.env.KAFKA_PORT,
  host: process.env.KAFKA_HOST,
  producer_send_timeout: process.env.KAFKA_PRODUCER_SEND_TIMEOUT
}));
