import { Module } from '@nestjs/common';
import { AntiFraudService } from './anti-fraud.service';

@Module({
  providers: [AntiFraudService],
  exports: [AntiFraudService],
})
export class ThirdPartiesModule {}
