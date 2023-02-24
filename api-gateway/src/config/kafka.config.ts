import { ClientProviderOptions, Transport } from '@nestjs/microservices';
import { EnvConfig } from './env.config';

export const TransactionKafkaConfig = (): ClientProviderOptions => {
  const host = EnvConfig.kafkaHost();
  const { name, clientId, groupId } = EnvConfig.kafkaConfig();
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
