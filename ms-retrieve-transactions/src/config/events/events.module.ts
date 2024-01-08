import { Module } from '@nestjs/common';
import { KafkaEventPublisher } from './kafka-event.publisher';
import { EventBusService } from './event-bus.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    CqrsModule,
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [process.env.KAFKA_BROKERCONNECT],
          },
          consumer: {
            groupId: process.env.KAFKA_CONSUMER_ID,
          },
        },
      },
    ]),
  ],
  providers: [
    {
      useClass: KafkaEventPublisher,
      provide: 'EVENT_PUBLISHER',
    },
    EventBusService,
  ],
  exports: [EventBusService],
})
export class EventsModule {}
