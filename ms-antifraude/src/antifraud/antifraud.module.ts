import { Module } from '@nestjs/common';
import { AntifraudService } from './antifraud.service';
import { KafkaProducerService } from 'src/kafka/producer.service';
import { KafkaConsumerService } from 'src/kafka/consumer.service';

@Module({
  providers: [AntifraudService, KafkaProducerService , KafkaConsumerService]
})
export class AntifraudModule {}
