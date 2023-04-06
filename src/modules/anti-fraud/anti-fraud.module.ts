import { Module } from '@nestjs/common';
import { AntifraudService } from './anti-fraud.service';
import { KafkaModule } from '../kafka/kafka.module';

@Module({
  imports: [KafkaModule],
  providers: [
    AntifraudService
  ],
  exports: [
    AntifraudService
],
})
export class AntiFraudModule {}