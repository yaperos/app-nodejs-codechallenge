import { Module } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { ProducerService } from './producer.service';

@Module({
    providers: [ConsumerService, ProducerService],
    exports: [ConsumerService, ProducerService]
})
export class KafkaModule { }
