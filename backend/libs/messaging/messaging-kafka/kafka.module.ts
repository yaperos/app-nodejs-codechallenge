import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envConfig } from 'libs/config/env.config';

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
              clientId: envConfig.kafka.clientId,
              brokers: envConfig.kafka.brokers,
            },
            consumer: { groupId: envConfig.kafka.groupId },
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
