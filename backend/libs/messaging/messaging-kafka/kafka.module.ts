import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { KafkaProducer } from './kafka.producer';

const brokers = (process.env.KAFKA_BROKERS ?? 'localhost:9092').split(',');
const clientId = process.env.KAFKA_CLIENT_ID ?? 'kafka-client';
const consumerGroupId = process.env.KAFKA_CONSUMER_GROUP_ID ?? 'kafka-consumer';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'KAFKA',
        useFactory: () => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId,
              brokers,
            },
            consumer: { groupId: consumerGroupId },
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
