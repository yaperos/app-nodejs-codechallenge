import { Module } from '@nestjs/common';
import { KafkaClientService } from './kafka-client.service';

@Module({
  providers: [KafkaClientService],
  exports: [KafkaClientService],
})
export class KafkaClientModule {}
