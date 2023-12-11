import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongoTransactionSchema } from './persistance/mongo/MongoTransaction';
import { TransactionRepository } from '../domain/TransactionRepository';
import { MongoTransactionRepository } from './persistance/MongoTransactionRepository';
import { CreateTransaction } from '../application/create-transaction/CreateTransaction';
import { FindTransaction } from '../application/find-transaction/FindTransaction';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Transaction',
        schema: MongoTransactionSchema,
      },
    ]),
    ClientsModule.register([
      {
        name: 'TRANSACTION_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'transaction',
            brokers: ['kafka:9092'],
          },
          consumer: {
            groupId: 'transaction-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [TransactionController],
  providers: [
    TransactionService,
    { provide: TransactionRepository, useClass: MongoTransactionRepository },
    CreateTransaction,
    FindTransaction,
  ],
})
export class TransactionModule {}
