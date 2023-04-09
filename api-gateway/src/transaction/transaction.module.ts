import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TransactionService } from './application/transaction.service';
import { TransactionController } from './infrastructure/transaction.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TRANSACTION-MICROSERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'transaction',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'transaction',
          },
        },
      },
    ]),
  ],
  providers: [TransactionService],
  controllers: [TransactionController],
})
export class TransactionModule {}
