import { Module } from '@nestjs/common';
import { ProducerService } from './producer.service';

@Module({
  providers: [ProducerService]
})
export class KafkaModule {}
