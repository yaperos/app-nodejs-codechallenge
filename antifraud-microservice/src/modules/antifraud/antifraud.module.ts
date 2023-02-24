import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { TransactionKafkaConfig } from '../../config/kafka.config';
import { AntifraudController } from './antifraud.controller';
import { AntifraudService } from './antifraud.service';

@Module({
  imports: [ClientsModule.register([TransactionKafkaConfig()])],
  controllers: [AntifraudController],
  providers: [AntifraudService],
})
export class AntifraudModule {}
