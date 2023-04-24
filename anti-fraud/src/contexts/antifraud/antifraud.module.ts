import { Module } from '@nestjs/common';
import { AntifraudService } from './antifraud.service';
import { KafkaModule } from '../../config/bus/kafka/kafka.module';
import { AntifraudController } from './antifraud.controller';

@Module({
  imports: [KafkaModule],
  controllers: [AntifraudController],
  providers: [AntifraudService ],
  exports: [AntifraudService],
})
export class AntifraudModule {}
