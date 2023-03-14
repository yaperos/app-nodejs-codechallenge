import {
  ClientProviderOptions,
  KafkaOptions,
  Transport,
} from '@nestjs/microservices';
import { environment } from '@core/config/environment';

/**
 * This function returns a KafkaOptions object that contains a Transport.KAFKA object and an options
 * object that contains a client object and a consumer object.
 * @returns A KafkaOptions object.
 */
export function TransactionKafkaConfig(): KafkaOptions {
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
 * It returns a ClientProviderOptions object that contains a name, transport, and options
 * @returns A ClientProviderOptions object.
 */
export function AntifraudKafkaConfig(): ClientProviderOptions {
  const { host, name, clientId, groupId } = environment.antifraudKafkaConfig;

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
