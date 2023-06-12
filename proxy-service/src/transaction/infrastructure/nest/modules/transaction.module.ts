import { Module } from '@nestjs/common';
import { TransactionController } from '../../transaction.controller';
import { KafkaService } from '../../kafka.service';
import { PubsubInterface } from '../../../domain/pubsub.interface';
import { CreateTransactionService } from '../../../application/create-transaction.service';
import { FindTransactionService } from '../../../application/find-transaction.service';
import { ServiceCommunicationInterface } from '../../../domain/service-communication.interface';
import { HttpService } from '../../http.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'PROXY_SERVICE',
        useFactory: () => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              brokers: [`${process.env.KAFKA_HOST}:${process.env.KAFKA_PORT}`],
            },
            consumer: {
              groupId: process.env.KAFKA_GROUP_ID,
            },
          },
        }),
      },
    ]),
  ],
  controllers: [TransactionController],
  providers: [
    {
      provide: PubsubInterface,
      useClass: KafkaService,
    },
    {
      provide: ServiceCommunicationInterface,
      useClass: HttpService,
    },
    CreateTransactionService,
    FindTransactionService,
  ],
})
export class TransactionModule {}
