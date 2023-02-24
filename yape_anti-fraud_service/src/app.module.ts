import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaModule } from './kafka/kafka.module';
import { AntiFraudConsumer } from './kafka/anti-fraud.consumer';

@Module({
  imports: [KafkaModule],
  controllers: [AppController],
  providers: [AppService, AntiFraudConsumer],
})
export class AppModule {}
