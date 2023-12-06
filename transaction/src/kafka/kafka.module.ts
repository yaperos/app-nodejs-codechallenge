import { Module } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { ConsumerService } from './consumer.service';

@Module({
	providers: [ProducerService, ConsumerService],
	exports: [ProducerService, ConsumerService],
})
/* eslint-disable @typescript-eslint/no-extraneous-class */
export class KafkaModule {}
