import { Module } from '@nestjs/common';
import { KafkaConsumerService } from 'src/services/kafka-consumer.service';
import { KafkaProducerService } from 'src/services/kafka-producer.service';

@Module({
  providers: [KafkaProducerService, KafkaConsumerService],
  exports: [KafkaProducerService, KafkaConsumerService],
})
export class KafkaModule {}
