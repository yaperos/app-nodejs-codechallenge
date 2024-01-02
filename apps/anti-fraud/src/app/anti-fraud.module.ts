import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MICROSERVICES_CONSTANTS } from '@yape-transactions/shared';

import { AntiFraudController } from './infrastructure/anti-fraud.controller';
import { AntiFraudService } from './application/anti-fraud.service';
import { NOTIFY_STATUS_CHANGED_PORT_TOKEN } from './domain/notify-status-changed.port';
import { NotifyStatusChangedAdapter } from './infrastructure/notify-status-changed.kafka.adapter';
import commonConfig from '../config/common-config';

// default: localhost:9092
const brokers = process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(',') : ['localhost:9092'];

@Module({
  imports: [
    ConfigModule.forRoot({ load: [commonConfig], isGlobal: true }),
    ClientsModule.register([
      {
        name: MICROSERVICES_CONSTANTS.TRANSFER_MANAGER_MICROSERVICE.name,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'anti-fraud',
            brokers,
          },
          producerOnlyMode: true,
          consumer: {
            groupId: MICROSERVICES_CONSTANTS.TRANSFER_MANAGER_MICROSERVICE.groupId,
          },
        },
      },
    ]),
  ],
  controllers: [AntiFraudController],
  providers: [AntiFraudService, {
    provide: NOTIFY_STATUS_CHANGED_PORT_TOKEN,
    useClass: NotifyStatusChangedAdapter
  }],
})
export class AntiFraudModule { }
