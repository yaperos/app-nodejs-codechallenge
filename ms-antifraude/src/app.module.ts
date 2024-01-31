import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AntifraudModule } from './antifraud/antifraud.module';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [AntifraudModule , KafkaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
