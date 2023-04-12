import { KafkaOptions, Transport } from '@nestjs/microservices';

export const kafkaConfig: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: 'anti-fraud-gateway',
      brokers: ['localhost:9092'],
    },
    consumer: {
      groupId: 'anti-fraud-service-consumer',
    },
  },
};
