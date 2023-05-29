import { Module } from '@nestjs/common';

import { KafkaProducerService } from 'src/adapters/externalServices/kafka/kafka.producer.service';
import { TransactionsService } from '../transactions/services/transactions.service';
import { EventsController } from './controller/events.controller';
import { KafkaConsumerService } from 'src/adapters/externalServices/kafka/kafka.consumer.service';

@Module({
  imports: [],
  controllers: [EventsController],
  providers: [KafkaConsumerService, KafkaProducerService, TransactionsService],
})
export class EventsModule {}
