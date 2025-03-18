import { Module } from '@nestjs/common';
import { AntiFraudService } from './anti-fraud.service';
import { AntiFraudController } from './anti-fraud.controller';
import { KafkaModule } from 'src/transports/kafka.module';

@Module({
  controllers: [AntiFraudController],
  providers: [AntiFraudService],
  imports: [KafkaModule],
})
export class AntiFraudModule {}
