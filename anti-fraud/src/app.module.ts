import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './modules/health/health.module';
import { KafkaModule } from './modules/kafka/kafka.module';
import { TransactionKafkaService } from './modules/transaction/infrastructure/services/transaction-kafka.service';
import { TransactionService } from './transaction.service';

@Module({
  imports: [HealthModule, ConfigModule.forRoot(), HttpModule, KafkaModule],
  controllers: [AppController],
  providers: [AppService, TransactionService, TransactionKafkaService],
})
export class AppModule {}
