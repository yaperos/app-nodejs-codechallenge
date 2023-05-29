import { Module } from '@nestjs/common';

import { KafkaConsumerService } from 'src/adapters/externalService/kafka/kafka.consumer.service';
import { TransactionsModule } from '../transactions/transactions.module';

@Module({
  imports: [TransactionsModule],
  controllers: [],
  providers: [KafkaConsumerService],
})
export class EventsModule {}
