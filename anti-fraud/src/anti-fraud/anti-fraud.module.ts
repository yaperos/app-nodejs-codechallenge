import { Module } from '@nestjs/common';
import { KafkaModule } from 'src/kafka/kafka.module';
import { AntiFraudConsumer } from './anti-fraud.consumer';

@Module({
  imports: [KafkaModule],
  providers: [AntiFraudConsumer]
})
export class AntiFraudModule {}
