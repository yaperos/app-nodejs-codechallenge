import { Module } from '@nestjs/common';
import { KafkaMessagingModule } from '@shared/messaging/messaging-kafka';

import { AntiFraudService } from './anti-fraud.service';

@Module({
  imports: [KafkaMessagingModule],
  providers: [AntiFraudService],
})
export class AntiFraudModule {}
