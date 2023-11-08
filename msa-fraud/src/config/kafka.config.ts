import {
  ClientsModuleOptions,
  MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';

export const KafkaConfig: MicroserviceOptions = {
  transport: Transport.KAFKA,
  options: {
    subcribe: {
      formBeginning: true,
    },
    consumer: {
      groupId: 'fraud-consumer',
    },
    client: {
      brokers: [process.env.KAFKA_URL],
    },
  },
} as MicroserviceOptions;

export const KafkaClient: ClientsModuleOptions = [
  {
    name: 'KAFKA',
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_URL],
      },
    },
  },
];

export const KAFKA_TRANSACTION_UPDATE = 'transaction-update';
export const KAFKA_TRANSACTION_FRAUD = 'transaction-fraud';
