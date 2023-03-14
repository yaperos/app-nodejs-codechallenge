import {
  ClientProviderOptions,
  KafkaOptions,
  Transport,
} from '@nestjs/microservices';
import { environment } from '@core/config/environment';

/**
 * It returns a AntiFraud KafkaOptions object that contains the host and groupId of the Kafka server
 * @returns KafkaOptions
 */
export function AntifraudKafkaConfig(): KafkaOptions {
  const host = environment.kafkaHost;
  const groupId = environment.kafkaGroupId;
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
}

/**
 * It returns a Transaction Service ClientProviderOptions object that contains the configuration for the Kafka client
 * @returns A ClientProviderOptions object.
 */
export function TransactionKafkaConfig(): ClientProviderOptions {
  const { host, name, clientId, groupId } = environment.transactionKafkaConfig;

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
}
