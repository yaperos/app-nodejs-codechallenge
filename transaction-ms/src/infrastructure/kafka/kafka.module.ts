import { Module } from '@nestjs/common';
import { KafkaProducer } from './kafka.producer';

@Module({
  providers: [KafkaProducer],
  exports: [KafkaProducer],
})
export class KafkaModule {}
