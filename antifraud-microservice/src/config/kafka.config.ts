import {
  ClientProviderOptions,
  KafkaOptions,
  Transport,
} from '@nestjs/microservices';
import { EnvConfig } from './env.config';

export const AntifraudKafkaConfig = (): KafkaOptions => {
  const host = EnvConfig.kafkaHost();
  const groupId = EnvConfig.kafkaGroupId();
  return {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [host],
      },
      consumer: {
        groupId,
      },
    },
  };
};

export const TransactionKafkaConfig = (): ClientProviderOptions => {
  const { host, name, clientId, groupId } = EnvConfig.transactionKafkaConfig();

  return {
    name,
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId,
        brokers: [host],
      },
      consumer: {
        groupId,
      },
    },
  };
};
