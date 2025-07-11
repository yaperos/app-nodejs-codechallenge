import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { getKafkaConfig } from './kafka.config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: getKafkaConfig('fraud-detection').clientId,
            brokers: getKafkaConfig('fraud-detection').brokers,
          },
          consumer: {
            groupId: getKafkaConfig('fraud-detection').groupId,
            allowAutoTopicCreation: true,
          },
          producer: {
            allowAutoTopicCreation: true,
          },
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class KafkaModule {}
