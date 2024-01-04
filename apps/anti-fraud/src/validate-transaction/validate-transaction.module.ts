import { Module } from '@nestjs/common';
import { ValidateTransactionService } from './validate-transaction.service';
import { ValidateTransactionController } from './validate-transaction.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        transport: Transport.KAFKA,
        name: 'TRANSACTION_SERVICE',
        options: {
          client: {
            clientId: 'anti-fraud-producer',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'transaction-group',
          },
        },
      },
    ]),
  ],
  controllers: [ValidateTransactionController],
  providers: [ValidateTransactionService],
})
export class ValidateTransactionModule {}
