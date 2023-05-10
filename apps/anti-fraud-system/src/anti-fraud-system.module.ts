import { Module } from '@nestjs/common';
import { AntiFraudSystemController } from './anti-fraud-system.controller';
import { AntiFraudSystemService } from './anti-fraud-system.service';

@Module({
  imports: [],
  controllers: [AntiFraudSystemController],
  providers: [AntiFraudSystemService],
})
export class AntiFraudSystemModule {}
