import { Module } from '@nestjs/common';

import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaService } from '../prisma/prisma.service';
import { KafkaEventsController } from '@kafka-events/kafka-events.controller';
import { KafkaEventsService } from '@kafka-events/kafka-events.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'transaction-service',
            brokers: process.env.KAFKA_BROKERS?.split(',') || [
              'localhost:9092',
            ],
          },
          consumer: {
            groupId: 'transaction-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [KafkaEventsController],
  providers: [KafkaEventsService, PrismaService],
})
export class KafkaEventsModule {}
