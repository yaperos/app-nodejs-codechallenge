import { Module } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: 'KAFKA_EVENT_BUS',
      useFactory: () => {
        return new ClientKafka({
          client: {
            clientId: 'transaction',
            brokers: ['localhost:9092'], // change to your broker list
          },
        });
      },
    },
  ],
})
export class EventBusModule {}