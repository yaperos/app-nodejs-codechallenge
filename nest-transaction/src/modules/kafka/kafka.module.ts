import { Module } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { CustomKafkaClientModule } from '../../app/kafka';

@Module({
  imports: [CustomKafkaClientModule],
  controllers: [],
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {}
