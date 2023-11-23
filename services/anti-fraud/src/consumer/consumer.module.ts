import { Module } from '@nestjs/common';
import { ConsumerController } from './consumer.controller';

@Module({
  controllers: [ConsumerController],
})
export class ConsumerModule {}
