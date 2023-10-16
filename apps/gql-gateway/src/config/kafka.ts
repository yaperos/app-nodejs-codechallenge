import { KafkaOptions, Transport } from '@nestjs/microservices';

export const KAFKA_CLIENT_CONFIG: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: 'gql-gateway',
      retry: {
        initialRetryTime: 5000,
        factor: 2,
        retries: 8,
      },
      brokers: [process.env.KAFKA_URL],
    },
    consumer: {
      groupId: 'gql-gateway-group',
    },
  },
};
