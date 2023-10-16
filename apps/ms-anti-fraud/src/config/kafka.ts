import { KafkaOptions, Transport } from '@nestjs/microservices';

export const KAFKA_CLIENT_CONFIG: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: 'antifraud',
      brokers: ['localhost:9092'],
    },
    consumer: {
      groupId: 'antifraud-consumer',
    },
  },
};
