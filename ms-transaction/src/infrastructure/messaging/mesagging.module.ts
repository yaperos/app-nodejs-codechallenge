import { Module } from '@nestjs/common';
import { ConsumerModule } from './consumer/consumer.module';

@Module({
  imports: [ConsumerModule],
  exports: [ConsumerModule],
})
export class MessagingModule {}
