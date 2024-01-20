import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Transaction } from './entity/transaction.entity';
import { DatabaseModule } from 'default/common';
import {
  ANTIFRAUD_CLIENT_ID,
  ANTIFRAUD_CONSUMER,
  ANTIFRAUD_SERVICE,
} from 'default/common/constants';

@Module({
  imports: [
    DatabaseModule,
    ClientsModule.register([
      {
        name: ANTIFRAUD_SERVICE,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: ANTIFRAUD_CLIENT_ID,
            brokers: ['kafka:29092'],
          },
          consumer: {
            groupId: ANTIFRAUD_CONSUMER,
          },
        },
      },
    ]),
    TypeOrmModule.forFeature([Transaction]),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
