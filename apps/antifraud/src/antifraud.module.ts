import { Module } from '@nestjs/common';
import { AntifraudController } from './antifraud.controller';
import { AntifraudService } from './antifraud.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  TRANSACTIONS_CLIENT_ID,
  TRANSACTIONS_CONSUMER,
  TRANSACTIONS_SERVICE,
} from 'default/common/constants';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: TRANSACTIONS_SERVICE,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: TRANSACTIONS_CLIENT_ID,
            brokers: ['kafka:29092'],
          },
          consumer: {
            groupId: TRANSACTIONS_CONSUMER,
          },
        },
      },
    ]),
  ],
  controllers: [AntifraudController],
  providers: [AntifraudService],
})
export class AntifraudModule {}
