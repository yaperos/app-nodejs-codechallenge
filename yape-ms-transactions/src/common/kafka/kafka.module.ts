import { Module } from '@nestjs/common';

/* Project */
import { KafkaService } from './kafka.service';

@Module({
  imports: [],
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {}
