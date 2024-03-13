import { Module } from '@nestjs/common';
import { AntiFraudController } from './antiFraud.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  kafkaConfig,
  msConfig,
  serverConfig,
} from '../../../infraestructure/config';
import { AntiFraudService } from './antiFraud.service';
import { TransactionService } from '../transaction/transaction.service';

@Module({
  controllers: [AntiFraudController],
  providers: [AntiFraudService, TransactionService],
  imports: [
    ClientsModule.register([
      {
        name: msConfig.nameAntiFraud,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: serverConfig.name,
            brokers: [kafkaConfig.broker],
          },
          consumer: {
            groupId: `${msConfig.nameAntiFraud}-consumer`,
          },
        },
      },
    ]),
  ],
})
export class AntiFraudModule {}
