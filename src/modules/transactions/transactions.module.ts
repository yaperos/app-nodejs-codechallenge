import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from './transaction.schema';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { KafkaModule } from '../kafka/kafka.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
    KafkaModule
  ],
  controllers: [TransactionsController],
  providers: [
    TransactionsService
  ],
  exports: [TransactionsService],
})
export class TransactionsModule {}