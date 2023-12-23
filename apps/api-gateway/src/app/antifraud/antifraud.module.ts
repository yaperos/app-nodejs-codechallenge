import { Module } from '@nestjs/common';
import { AntifraudService } from './antifraud.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ANTIFRAUD_MICROSERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'antifraud',
            brokers: ['localhost:9092'],
          },
          producerOnlyMode: false,
          consumer: {
            groupId: 'antifraud-consumer',
          },
        },
      },
    ]),
  ],
  providers: [AntifraudService],
  exports:[AntifraudService]
})
export class AntifraudModule {}
