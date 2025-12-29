import { Module } from '@nestjs/common';
import { KafkaProducer } from './kafka.producer';
import { KafkaStatusConsumer } from './kafka.status.consumer';

@Module({
  providers: [KafkaProducer, KafkaStatusConsumer],
  exports: [KafkaProducer], // 👈 IMPORTANTE
})
export class KafkaModule {}
