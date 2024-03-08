import { KafkaOptions, Transport } from '@nestjs/microservices';
import { serverConfig, kafkaConfig } from '../config';
import { Partitioners } from 'kafkajs';

export const MicroserviceConfig: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: serverConfig.name,
      brokers: [kafkaConfig.broker],
    },
    consumer: {
      groupId: serverConfig.name,
      allowAutoTopicCreation: true,
    },
    producer: {
      createPartitioner: Partitioners.LegacyPartitioner,
    },
  },
};
