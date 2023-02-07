import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Producer } from './Producer';

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MY_CLIENT_KAFKA',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
            clientId: 'anti-fraud',
          },
          consumer: {
            groupId: 'micro-anti-fraud',
          },
        },
      },
    ]),
  ],
  providers: [Producer],
  exports: [Producer],
})
export class EventModule {}
