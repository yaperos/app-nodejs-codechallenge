import { Module } from '@nestjs/common';
import { LoggerController } from './logger.controller';
import { LoggerService } from './logger.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  kafkaConfig,
  msConfig,
  serverConfig,
} from '../../../infraestructure/config';

@Module({
  controllers: [LoggerController],
  providers: [LoggerService],
  imports: [
    ClientsModule.register([
      {
        name: msConfig.nameLogger,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: serverConfig.name,
            brokers: [kafkaConfig.broker],
          },
          consumer: {
            groupId: `${msConfig.nameLogger}-consumer`,
          },
        },
      },
    ]),
  ],
})
export class LoggerModule {}
