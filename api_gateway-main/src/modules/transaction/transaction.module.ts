import { Module } from '@nestjs/common';
import { TransactionController } from './controllers/transaction.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  TRANSACTION_SERVICE_CM,
  TRANSACTION_SERVICE_QR,
} from 'src/config/services';
import { TransactionService } from './services/transaction.service';
import { envs } from 'src/config/envs';

@Module({
  controllers: [TransactionController],
  imports: [
    ClientsModule.register([
      {
        name: TRANSACTION_SERVICE_QR,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'gateway-transaction-qr',
            brokers: [envs.KAFKA_BROKER],
          },
          consumer: { groupId: 'transaction-group-qr' },
        },
      },
      {
        name: TRANSACTION_SERVICE_CM,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'gateway-transaction-cm',
            brokers: [envs.KAFKA_BROKER],
          },
          consumer: { groupId: 'transaction-group-cm' },
        },
      },
    ]),
  ],
  providers: [TransactionService],
})
export class TransactionModule {}
