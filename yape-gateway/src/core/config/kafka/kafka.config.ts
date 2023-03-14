import { ClientProviderOptions, Transport } from '@nestjs/microservices';
import { environment } from '@core/config/environment';

export function TransactionKafkaConfig(): ClientProviderOptions {
  const host = environment.kafkaHost;
  const { name, clientId, groupId } = environment.kafkaConfig;

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
      } 
    },
  };
}
