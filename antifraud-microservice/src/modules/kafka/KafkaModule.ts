import { Module } from '@nestjs/common';
import { ConfigurationModule } from '../config/ConfigurationModule';
import { KafkaService } from './infrastructure/KafkaService';
import { KafkaProducerService } from './producer/KakfaProducer';
import { KafkaConsumerService } from './consumer/KafkaConsumer';
@Module({
  imports: [ConfigurationModule],
  providers: [KafkaService, KafkaProducerService, KafkaConsumerService],
  exports: [KafkaService, KafkaProducerService, KafkaConsumerService],
})
export class KafkaModule {}
