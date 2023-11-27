import { Module } from '@nestjs/common';
import { KafkaConsumerService } from './services/kafka-consumer.service';
import { KafkaProducerService } from './services/kafka-producer.service';
import { KafkaService } from './services/kafka.service';

@Module({
  providers: [KafkaService, KafkaProducerService, KafkaConsumerService],
  exports: [KafkaService],
})
export class KafkaModule {}
