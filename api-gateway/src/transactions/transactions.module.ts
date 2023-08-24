import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsResolver } from './transactions.resolver';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TRANSACTION_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'transaction',
            brokers: [process.env.KAFKA_HOST]
          },
          consumer: {
            groupId: 'transaction-consumer'
          }
        }
      }
    ]),
  ],
  providers: [TransactionsService, TransactionsResolver]
})
export class TransactionsModule { }
