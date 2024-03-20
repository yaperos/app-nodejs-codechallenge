import { Module } from '@nestjs/common';
import { KafkaProducerModule } from '../../services/kafka/producer/kafka-producer.module';
import { TransactionProducer } from './transaction.producer';
import { LoggerModule } from '../../services/logger/logger.module';

@Module({
  imports: [KafkaProducerModule, LoggerModule],
  providers: [TransactionProducer],
  exports: [TransactionProducer],
})
export class ProducerModule {}
