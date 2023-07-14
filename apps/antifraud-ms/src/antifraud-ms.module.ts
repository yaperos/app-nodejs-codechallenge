import { Module } from '@nestjs/common';
import { AntifraudMsService } from './antifraud-ms.service';
import { TransactionCreatedListener } from './interfaces/listeners/transaction-created/transaction-created.listener';
import { ValidateTransactionService } from './application/services/validate-transaction.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { HealthcheckListener } from './interfaces/listeners/healthcheck/healthcheck.listener';
import { HealthcheckService } from './application/services/healthcheck.service';
import * as kafkaConfig from '../config/kafka.config';

const imports = [
  ClientsModule.register([
    {
      name: 'TRANSACTION_SERVICE',
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: kafkaConfig.KAFKA_TRANSACTION_CLIENT_ID,
          brokers: [kafkaConfig.KAFKA_BROKER],
        },
        consumer: {
          groupId: kafkaConfig.KAFKA_TRANSACTION_GROUP_ID,
        },
      },
    },
  ]),
];

const listeners = [HealthcheckListener, TransactionCreatedListener];

const services = [
  AntifraudMsService,
  HealthcheckService,
  ValidateTransactionService,
];

@Module({
  imports: [...imports],
  controllers: [...listeners],
  providers: [...services],
})
export class AntifraudMsModule {}
