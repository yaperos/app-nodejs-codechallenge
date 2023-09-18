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
import { TransactionService } from '../services/transaction.service';
import { DataupdateService } from '../services/dataupdate.service';

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
  providers: [TransactionService, DataupdateService],
  exports: [TransactionService, DataupdateService],
})
export class TransactionModule {}
