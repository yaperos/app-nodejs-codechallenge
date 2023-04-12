import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TransactionController } from './controller/transaction.controller';
import {TransactionRepo} from "./transaction.repo";
import {MongooseModule} from "@nestjs/mongoose";
import {transactionModel, transactionSchema} from "./schema/transaction.schema";
import {TransactionService} from "./service/transaction.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: transactionModel.name, schema: transactionSchema}
    ]),
    ClientsModule.register([
      {
        name: 'TRANSACTION_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'transaction-gateway',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'transaction-service-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [TransactionController],
  providers: [
    TransactionService,
    {
      useClass: TransactionRepo,
      provide: 'TRANSACTION_REPO',
    }
  ],
  exports: [
    TransactionService
  ],
})
export class TransactionsModule {}
