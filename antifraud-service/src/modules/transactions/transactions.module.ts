import { Module } from '@nestjs/common';

import { TransactionsService } from './services/transactions.service';
import { KafkaProducerService } from 'src/adapters/externalServices/kafka/kafka.producer.service';

@Module({
  imports: [KafkaProducerService],
  controllers: [],
  providers: [TransactionsService],
})
export class TransactionsModule {}
