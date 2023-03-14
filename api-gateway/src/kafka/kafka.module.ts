import { Global, Module } from '@nestjs/common';
import { ConsumerService } from './consummer/consumer.service';
import { ProducerService } from './producer/producer.service';

@Global()
@Module({
  providers: [ConsumerService, ProducerService],
  exports: [ProducerService, ConsumerService],
})
export class KafkaModule {}
