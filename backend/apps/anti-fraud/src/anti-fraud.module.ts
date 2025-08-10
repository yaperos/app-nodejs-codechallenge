import { Module } from '@nestjs/common';
import { MessagingKafkaModule } from '@shared/messaging/messaging-kafka';
import { AntiFraudConsumer } from 'apps/anti-fraud/src/anti-fraud.consumer';

import { AntiFraudService } from './anti-fraud.service';

@Module({
  controllers: [AntiFraudConsumer],
  imports: [MessagingKafkaModule],
  providers: [AntiFraudService],
})
export class AntiFraudModule {}
