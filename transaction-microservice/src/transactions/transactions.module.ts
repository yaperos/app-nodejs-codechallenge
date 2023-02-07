import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsService } from './services/transactions.service';
import { TransactionsController } from './controllers/transactions.controller';
import { Transaction } from './entities/transaction.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TransactionsResolver } from './resolvers/transactions.resolver';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TRANSACTIONSERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'transactions-kafka',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'kafka-transactions-16',
          },
        },
      },
    ]),
    TypeOrmModule.forFeature([Transaction]),
  ],
  providers: [TransactionsService, TransactionsResolver],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
