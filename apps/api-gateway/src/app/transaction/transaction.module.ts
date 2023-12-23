import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { AntifraudService } from '../antifraud/antifraud.service';

@Module({
    imports: [
      ClientsModule.register([
        {
          name: 'TRANSACTION_MICROSERVICE',
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'transaction',
              brokers: ['localhost:9092'],
            },
            producerOnlyMode: false,
            consumer: {
              groupId: 'transaction-consumer',
            },
          },
        },
        {
          name: 'ANTIFRAUD_MICROSERVICE',
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'antifraud',
              brokers: ['localhost:9092'],
            },
            producerOnlyMode: false,
            consumer: {
              groupId: 'antifraud-consumer',
            },
          },
        },
      ]),      
    ],
    providers: [TransactionService, AntifraudService],
    controllers: [TransactionController],
  }
    
)
export class TransactionModule {}
