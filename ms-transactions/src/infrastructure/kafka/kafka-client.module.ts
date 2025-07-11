import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { getKafkaConfig } from './kafka.config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: getKafkaConfig('ms-transactions').clientId,
            brokers: getKafkaConfig('ms-transactions').brokers,
          },
          consumer: {
            groupId: getKafkaConfig('ms-transactions').groupId,
          },
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class KafkaClientModule {}
