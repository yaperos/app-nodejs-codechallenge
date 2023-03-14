import { Module } from '@nestjs/common';
import { AntifraudController } from './antifraud.controller';
import { AntifraudService } from './antifraud.service';
import { KafkaConfigService } from './config/kafka-config.service';

@Module({
  imports: [
    KafkaConfigService.registerModuleKafka(),
  ],
  controllers: [AntifraudController],
  providers: [AntifraudService],
})
export class AntifraudModule {}
