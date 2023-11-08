import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaModule } from './kafka/kafka.module';
import { ConfigModule } from '@nestjs/config';
import { AntiFraudConsumer } from './anti-fraud.consumer';

@Module({
  imports: [
    KafkaModule,
    ConfigModule.forRoot({isGlobal: true})
  ],
  controllers: [AppController],
  providers: [AppService, AntiFraudConsumer],
})
export class AppModule {}
