import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ModelInterface } from 'src/../start/interfaces/model.interface';
import { ClientsModule, Transport } from '@nestjs/microservices';
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
import { AntifraudService } from '../services/antifraud.service';

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
            groupId: 'kafka-consumer-antif',
          },
        },
      },
    ]),
  ],
  providers: [AntifraudService],
  exports: [AntifraudService],
})
export class AntifraudModule {}
