import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { KafkaModule } from '../kafka/kafka.module';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { Transaction, TransactionSchema } from './entities/transaction.entity';

@Module({
  imports: [
    KafkaModule,
    MongooseModule.forFeature([
      {
        name: Transaction.name,
        schema: TransactionSchema,
      },
    ]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
