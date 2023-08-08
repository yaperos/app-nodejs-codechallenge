import { Module } from '@nestjs/common';
import { MsAntifraudController } from './ms-antifraud.controller';
import { MsAntifraudService } from './ms-antifraud.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MS_TRANSACTION',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'antifraud',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'transaction-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [MsAntifraudController],
  providers: [MsAntifraudService],
})
export class MsAntifraudModule {}
