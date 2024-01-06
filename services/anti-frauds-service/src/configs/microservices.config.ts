import { registerAs } from '@nestjs/config';

export default registerAs(
  'microservices',
  (): Record<string, any> => ({
    kafka: {
      host: process.env.KAFKA_HOST,
      port: process.env.KAFKA_PORT,
    },
  }),
);
