import { Module } from '@nestjs/common';
import { AntifraudService } from './antifraud.service';
import { KafkaService } from 'src/kafka/kafka.service';

@Module({
  providers: [AntifraudService, KafkaService],
})
export class AntifraudModule {}
