import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { kafkaTransactionConfigFactory } from './kafka-transaction.config';

@Module({
  imports: [
    forwardRef(() => ConfigModule.forFeature(kafkaTransactionConfigFactory)),
  ],
})
export class KafkaModule {}
