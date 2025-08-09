import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { KafkaProducer } from './kafka.producer';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'KAFKA',
        useFactory: () => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'process.env.KAFKA_CLIENT_ID',
              brokers: ['process.env.KAFKA_BROKERS'],
            },
            consumer: { groupId: 'process.env.KAFKA_CONSUMER_GROUP_ID' },
            run: { autoCommit: true },
            subscribe: { fromBeginning: false },
          },
        }),
      },
    ]),
  ],
  providers: [KafkaProducer],
  exports: [KafkaProducer],
})
export class KafkaMessagingModule {}