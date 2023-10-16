import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {ConfigService} from "@nestjs/config";
import {config} from "dotenv";

config();
const configService = new ConfigService();

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: configService.get('KAFKA_CLIENT'),
            brokers: [configService.get('KAFKA_BROKER')],
          },
          consumer: {
            groupId: configService.get('KAFKA_CONSUMER'),
          },
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class KafkaModule {}
