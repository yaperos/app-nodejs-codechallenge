import { Module } from '@nestjs/common';
import { KafkaModule } from './service/kafka.module';
import { ConfigModule } from '@nestjs/config';
import { kafkaConfig, applicationConfig } from './config/kafka.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // ✅ Leer desde archivo .env
      load: [kafkaConfig, applicationConfig],
      cache: true,
    }),
    KafkaModule
  ]
})
export class AppModule {}