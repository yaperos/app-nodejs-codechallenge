import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from '../schemas/transaction.schema';
import { TransactionType, TransactionTypeSchema } from '../schemas/transaction_type.schema';
import { KafkaService } from '../kafka/kafka';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
      { name: TransactionType.name, schema: TransactionTypeSchema },
    ]),
  ],
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    {
      provide: KafkaService,
      useFactory: () => {
        return new KafkaService(
          'api-client',
          'api-consumer',
          ['localhost:9092'],
        );
      },
    }
  ]
})
export class TransactionsModule {}
