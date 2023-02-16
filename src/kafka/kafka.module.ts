import { Module } from '@nestjs/common';
import { ConsumerService } from './consumer/consumer.service';
import { ProducerService } from './producer/producer.service';


@Module({
  imports:[],
  providers: [ConsumerService, ProducerService],
  exports: [ConsumerService, ProducerService],
})
export class KafkaModule {}
