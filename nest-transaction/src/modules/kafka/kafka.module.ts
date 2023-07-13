import { Module } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { CustomKafkaClientModule } from '../../app/kafka';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, CustomKafkaClientModule],
  controllers: [],
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {}
