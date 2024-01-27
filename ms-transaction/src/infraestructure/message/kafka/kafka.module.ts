import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProducerService } from './producer.service';
import { ConsumerService } from './consumer.service';


@Module({
  imports: [ConfigModule],
  providers: [ProducerService,ConsumerService],
  exports: [ProducerService,ConsumerService],
})
export class KafkaModuleCustom {}