import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { KafkaModule } from '../kafka/kafka.module';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';

import {
  TransactionState,
  TransactionStateSchema,
} from './entities/transaction.state.entity';
import { Transaction, TransactionSchema } from './entities/transaction.entity';
import { TransactionStateService } from './transaction.state.service';

@Module({
  imports: [
    KafkaModule,
    MongooseModule.forFeature([
      {
        name: Transaction.name,
        schema: TransactionSchema,
      },
      {
        name: TransactionState.name,
        schema: TransactionStateSchema,
      },
    ]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionStateService],
})
export class TransactionModule {}
