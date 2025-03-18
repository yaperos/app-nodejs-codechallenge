import { Module } from '@nestjs/common';
import { AntiFraudModule } from './anti-fraud/anti-fraud.module';
import { KafkaModule } from './transports/kafka.module';

@Module({
  imports: [AntiFraudModule, KafkaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
