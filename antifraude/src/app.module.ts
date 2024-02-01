import { AntifraudService } from './antifraud/services/antifraud.service';
import { Module } from '@nestjs/common';
import { KafkaService } from './antifraud/services-core/kafka.service';

@Module({
  imports: [
  ],
  controllers: [],
  providers: [
    AntifraudService,KafkaService
  ],
})
export class AppModule {}
