import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.rest.controller';
import { TransactionService } from './transactions.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transactions } from './transactions.entity';
import { AppController } from './transaction.event.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ANTIFRAUD_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'antifraud',
            brokers: ['localhost:29092'],
          },
          consumer: {
            groupId: 'antifraud-consumer',
          },
          run: {
            autoCommit: false,
          },
        },
      },
    ]),

    TypeOrmModule.forFeature([Transactions]),
  ],
  controllers: [TransactionsController, AppController],
  providers: [TransactionService],
})
export class TransactionsModule {}
