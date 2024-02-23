import { Module } from '@nestjs/common';
import { ProducerModule } from './producer/producer.module';
import { ConsumerModule } from './consumer/consumer.module';

@Module({
  imports: [
    ProducerModule,
    ConsumerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
