import { Module } from '@nestjs/common';

import { StreamingService } from 'src/streaming/streaming.service';
import { EventsController } from 'src/anti-fraud/infrastructure/in/events.controller';
import { AntiFraudVerificiationService } from 'src/anti-fraud/application/anti-fraud-verification.service';
import { StreamingModule } from 'src/streaming/streaming.module';

@Module({
  imports: [StreamingModule],
  providers: [StreamingService, AntiFraudVerificiationService],
  controllers: [EventsController],
})
export class AntiFraudModule {}
