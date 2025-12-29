import { Module } from '@nestjs/common';
import { AntiFraudConsumer } from './anti-fraud.consumer';

@Module({
  providers: [AntiFraudConsumer],
})
export class KafkaModule {}
