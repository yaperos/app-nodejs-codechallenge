import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Producer } from './Producer';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MY_CLIENT_KAFKA',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
            clientId: 'transaction',
          },
          consumer: {
            groupId: 'transaction',
          },
        },
      },
    ]),
  ],
  providers: [Producer],
  exports: [Producer],
})
export class EventModule {}
