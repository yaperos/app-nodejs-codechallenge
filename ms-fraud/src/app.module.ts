import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { KafkaMiddleware } from '@src/core/middleware/kafka.middleware';
import { KafkaConfigService } from '@src/core/services/kafka-config.services';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [KafkaMiddleware, KafkaConfigService],
})
export class AppModule {}
