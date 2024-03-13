import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { kafkaConfig, msConfig } from '../../../infraestructure/config';
import { Partitioners } from 'kafkajs';
import { AntiFraudService } from './antiFraud.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: msConfig.nameAntiFraud,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: `${msConfig.nameTransactions}-${msConfig.nameAntiFraud}`,
            brokers: [kafkaConfig.broker],
          },
          producerOnlyMode: true,
          consumer: {
            groupId: `${msConfig.nameAntiFraud}-consumer`,
          },
          producer: {
            createPartitioner: Partitioners.LegacyPartitioner,
          },
        },
      },
    ]),
  ],
  providers: [AntiFraudService],
  exports: [AntiFraudService],
})
export class AntiFraudModule {}
