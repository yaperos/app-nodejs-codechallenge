import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

import { KafkaModule } from 'src/adapters/externalService/kafka/kafka.module';
import { TypesModule } from 'src/modules/types/types.module';
import {
  Transactions,
  TransactionsSchema,
} from 'src/adapters/database/mongo/transactions/transactions.schema';
import { TransactionsRepository } from 'src/adapters/database/mongo/transactions/transactions.repository';
import { EventsController } from '../events/controller/events.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transactions.name, schema: TransactionsSchema },
    ]),
    KafkaModule,
    TypesModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService, TransactionsRepository, EventsController],
})
export class TransactionsModule {}
