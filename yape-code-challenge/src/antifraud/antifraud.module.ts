import { Module } from '@nestjs/common';
import { AntifraudService } from './antifraud.service';
import { KafkaService } from '@/kafka/kafka.service';

@Module({
  providers: [AntifraudService, KafkaService],
})
export class AntifraudModule {}
