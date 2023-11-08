import { MicroserviceOptions, Transport } from '@nestjs/microservices';

export const KafkaConfig: MicroserviceOptions = {
  transport: Transport.KAFKA,
  options: {
    subcribe: {
      formBeginning: true,
    },
    consumer: {
      groupId: 'transaction-consumer',
    },
    client: {
      brokers: [process.env.KAFKA_URL],
    },
  },
} as MicroserviceOptions;
