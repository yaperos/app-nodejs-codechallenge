import { Module } from '@nestjs/common';
import { AntiFraudController } from './anti-fraud.controller';
import { AntiFraudService } from './anti-fraud.service';
import { KafkaModule } from 'kafka.module';

@Module({
  controllers: [AntiFraudController],
  providers: [AntiFraudService],
  imports: [KafkaModule],
})
export class AntiFraudModule {}
