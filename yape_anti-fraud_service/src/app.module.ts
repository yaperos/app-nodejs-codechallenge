import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AntiFraudsModule } from './anti-frauds/anti-frauds.module';
import { KafkaModule } from './kafka/kafka.module';
import { AntiFraudConsumer } from "./kafka/anti-fraud.consumer";

@Module({
  imports: [AntiFraudsModule, KafkaModule],
  controllers: [AppController],
  providers: [AppService, AntiFraudConsumer],
})
export class AppModule {}
