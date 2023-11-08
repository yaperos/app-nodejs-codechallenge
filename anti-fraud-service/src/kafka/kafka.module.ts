import { Module } from '@nestjs/common';
import { ConsumerService } from './consumer.service';

@Module({
  imports: [],
  providers: [ConsumerService],
  exports: [ConsumerService],
})
export class KafkaModule {}
