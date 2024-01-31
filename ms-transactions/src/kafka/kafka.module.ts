import { Module } from '@nestjs/common';
import { KafkaProducerService } from './producer.service';
import { KafkaConsumerService } from './consumer.service';

@Module({
  imports: [],
  providers: [KafkaProducerService, KafkaConsumerService],
  exports: [KafkaProducerService, KafkaConsumerService],
})
export class KafkaModule {}