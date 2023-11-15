// src/kafka/kafka.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import kafkaConfig from './kafka.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [kafkaConfig],
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class KafkaModule {}
