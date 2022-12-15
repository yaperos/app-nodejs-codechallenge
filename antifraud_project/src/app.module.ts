import { Module } from '@nestjs/common';

import { MessageConsumerController } from './adapter/input/messaging/message_consumer.controller';
import { KafkaService } from './adapter/input/messaging/kafka.service';

@Module({
  imports: [],
  controllers: [MessageConsumerController],
  providers: [KafkaService],
})
export class AppModule {}
