import { Module } from '@nestjs/common';
import { ClientKafka, ClientsModule, Transport } from '@nestjs/microservices';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import {
  TransactionRepository,
  TransactionTypeRepository,
} from './transaction/repositories';
import { TransactionService } from './transaction/services';

const services = [
  TransactionRepository,
  TransactionTypeRepository,
  TransactionService,
  {
    provide: 'KAFKA_PRODUCER',
    useFactory: async (kafkaService: ClientKafka) => {
      return kafkaService.connect();
    },
    inject: ['TRANSACTION_MICROSERVICE'],
  },
];

@Module({
  imports: [
    InfrastructureModule,
    ClientsModule.register([
      {
        name: 'TRANSACTION_MICROSERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'transaction',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'transaction-consumer',
          },
        },
      },
    ]),
  ],
  providers: services,
  exports: services,
})
export class ApplicationCoreModule {}
