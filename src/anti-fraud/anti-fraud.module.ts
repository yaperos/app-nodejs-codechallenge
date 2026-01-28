import { Module } from '@nestjs/common';
import { AntiFraudService } from './services/anti-fraud.service';
import { AntiFraudConsumer } from './consumers/anti-fraud.consumer';

@Module({
  providers: [AntiFraudService, AntiFraudConsumer],
  exports: [AntiFraudService, AntiFraudConsumer],
})
export class AntiFraudModule {}