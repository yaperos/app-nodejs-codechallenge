import { Global, Module } from '@nestjs/common';
import { KafkaDecoratorProcessorService } from './KafkaDecoratorProcessorService';

@Global()
@Module({
  imports: [],
  providers: [KafkaDecoratorProcessorService],
  exports: [KafkaDecoratorProcessorService],
})
export class KafkaProcessorModule {}
