import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ReactiveKafkaConsumer } from './kafka-consumer.service';
import { ReactiveKafkaProducer } from './kafka-producer.service';
import { TransactionService } from './transaction.service';
import { kafkaConfig, applicationConfig } from '../config/kafka.config';

@Module({
  imports: [
    ConfigModule.forFeature(kafkaConfig),
    ConfigModule.forFeature(applicationConfig),
  ],
  providers: [
    ReactiveKafkaConsumer, 
    ReactiveKafkaProducer, 
    TransactionService
  ],
  exports: [
    TransactionService, 
    ReactiveKafkaProducer,
    ReactiveKafkaConsumer
  ]
})
export class KafkaModule {}
