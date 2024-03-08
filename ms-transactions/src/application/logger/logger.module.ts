import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { kafkaConfig, msConfig } from 'src/infraestructure/config';
import { LoggerService } from './logger.service';
import { Partitioners } from 'kafkajs';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: msConfig.nameLogger,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: `${msConfig.nameTransactions}-${msConfig.nameLogger}`,
            brokers: [kafkaConfig.broker],
          },
          producerOnlyMode: true,
          consumer: {
            groupId: `${msConfig.nameLogger}-consumer`,
          },
          producer: {
            createPartitioner: Partitioners.LegacyPartitioner,
          },
        },
      },
    ]),
  ],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
