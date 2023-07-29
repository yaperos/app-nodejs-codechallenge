import { Module } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { ConfigKafkaClientModule } from '../config/kafka-config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, ConfigKafkaClientModule],
  controllers: [],
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {}
