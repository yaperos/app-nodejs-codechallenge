import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
// Interfaces
import { ModelInterface } from 'src/../start/interfaces/model.interface';
// Entities
import { Transaction, TransactionSchema } from '../entities/transaction.entity';
const models: ModelInterface[] = [
  {
    name: Transaction.name,
    schema: TransactionSchema,
    collection: 'transactions',
  },
];
// Services
import { CreationTransactionService } from '../services/creationTransaction.service';
import { GettingTransactionService } from '../services/gettingTransaction.service';
import { DataupdateService } from '../services/dataupdate.service';
import { TransactionTypesUtility } from '../utilities/transactionTypes.utility';
@Module({
  imports: [
    MongooseModule.forFeature(models),
    ClientsModule.register([
      {
        name: 'SERVER',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [process.env.KAFKA_SERVER],
            ssl: true,
            sasl: {
              mechanism: 'plain',
              username: process.env.KAFKA_KEY,
              password: process.env.KAFKA_SECRET,
            },
          },
          consumer: {
            groupId: 'kafka-consumer',
          },
        },
      },
    ]),
  ],
  providers: [
    CreationTransactionService,
    DataupdateService,
    GettingTransactionService,
    TransactionTypesUtility,
  ],
  exports: [
    CreationTransactionService,
    DataupdateService,
    GettingTransactionService,
    TransactionTypesUtility,
  ],
})
export class TransactionModule {}
