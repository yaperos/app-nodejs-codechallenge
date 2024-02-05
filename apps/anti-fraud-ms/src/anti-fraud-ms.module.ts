import { Module } from '@nestjs/common';
import { AntiFraudMsController } from './anti-fraud-ms.controller';
import { AntiFraudMsService } from './anti-fraud-ms.service';

@Module({
  imports: [],
  controllers: [AntiFraudMsController],
  providers: [AntiFraudMsService],
})
export class AntiFraudMsModule {}
