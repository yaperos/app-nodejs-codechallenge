import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { TransactionsResolver } from './transactions.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entity/transaction.entity';
import env from 'src/confi/env';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    ClientsModule.register([
      {
        name: 'TRANSACTION_MICROSERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'transaction',
            brokers: [env.KAFKA_BROKER],
          },
          consumer: {
            groupId: 'transaction-group',
          },
        },
      },
    ]),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService, TransactionsResolver],
})
export class TransactionsModule {}
