import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaModule } from './kafka/kafka.module';
import { TransactionCreatedConsumer } from './transaction-created.consumer';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    KafkaModule
  ],
  controllers: [AppController],
  providers: [AppService, TransactionCreatedConsumer],
})
export class AppModule { }
