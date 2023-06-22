/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FINANCIAL_TRANSACTIONS_CONSUMER } from './constans/kafka-topics';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'FINANCIAL_TRANSACTIONS_MICROSERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'financial-transactions',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: FINANCIAL_TRANSACTIONS_CONSUMER,
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
