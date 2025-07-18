import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ReactiveKafkaConsumer } from './kafka-consumer.service';
import { ReactiveKafkaProducer } from './kafka-producer.service';
import { TransactionsModule } from '../transactions/transaction.module';
import { kafkaConfig } from '../config/kafka.config';

/**
 * Kafka Module
 * Manages Kafka consumers and producers
 */
@Module({
  imports: [
    ConfigModule.forFeature(kafkaConfig), // Register kafka configuration
    forwardRef(() => TransactionsModule), // Use forwardRef to avoid circular dependency
  ],
  providers: [
    ReactiveKafkaConsumer,
    ReactiveKafkaProducer,
  ],
  exports: [
    ReactiveKafkaConsumer,
    ReactiveKafkaProducer,
  ],
})
export class KafkaModule {}
