import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { HealthModule } from './modules/health/health.module';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { HttpModule } from '@nestjs/axios';
import { TransactionService } from './transaction.service';
import { KafkaModule } from './modules/kafka/kafka.module';
import { TransactionKafkaService } from './modules/transaction/infrastructure/services/transaction-kafka.service';

@Module({
  imports: [
    HealthModule, ConfigModule.forRoot(), HttpModule, KafkaModule],
  controllers: [AppController],
  providers: [AppService, TransactionService, TransactionKafkaService],
})
export class AppModule { }
