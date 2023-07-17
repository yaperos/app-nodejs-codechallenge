import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { ClientsModule, Transport } from '@nestjs/microservices';
import { config } from 'dotenv';
import { HttpModule } from '@nestjs/axios';

import { AntifraudController } from './antifraud.controller';
import { AntifraudService } from './antifraud.service';

config();

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: process.env.KAFKA_NAME,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: process.env.KAFKA_CLIENT,
            brokers: [process.env.KAFKA_BOOTSTRAP_SERVERS],
          },
          consumer: {
            groupId: process.env.KAFKA_GROUP_ID,
          },
        },
      },
    ]),
    HttpModule.register({
      baseURL: process.env.TRANSACTIONS_SERVICE_URL,
    }),
  ],
  controllers: [AntifraudController],
  providers: [AntifraudService],
})
export class AntifraudModule { }
