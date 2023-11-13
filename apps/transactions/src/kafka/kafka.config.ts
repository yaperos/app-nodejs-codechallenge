import {
  ClientProviderOptions,
  ClientsModuleOptions,
  Transport,
} from '@nestjs/microservices';
import { CLIENT_KAFKA } from 'src/transactions/transactions.constants';

export const KafkaConfig: ClientProviderOptions = {
  name: 'KAFKA_SERVICE',
  transport: Transport.KAFKA,
  options: {
    consumer: {
      groupId: 'transaction-group',
    },
    client: {
      clientId: CLIENT_KAFKA.ID_TRANSACTION,
      brokers: [process.env.KAFKA_URL],
    },
  },
} as ClientProviderOptions;

export const KafkaClient: ClientsModuleOptions = [
  {
    name: 'KAFKA_CLIENT',
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
