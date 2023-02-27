import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { TransactionRepository } from './transaction/repositories';
import { TransactionService } from './transaction/services';

const services = [TransactionRepository, TransactionService];

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
