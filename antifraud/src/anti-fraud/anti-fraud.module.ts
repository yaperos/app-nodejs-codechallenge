import { Logger, Module } from '@nestjs/common';
import { AntiFraudController } from './anti-fraud.controller';
import { AntiFraudService } from './anti-fraud.service';

@Module({
  imports: [],
  controllers: [AntiFraudController],
  providers: [AntiFraudService],
})
export class AntiFraudModule {}
