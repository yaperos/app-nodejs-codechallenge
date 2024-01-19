import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { kafkaAntiFraudConfigFactory } from './kafka-anti-fraud.config';

@Module({
  imports: [
    forwardRef(() => ConfigModule.forFeature(kafkaAntiFraudConfigFactory)),
  ],
})
export class KafkaModule {}
