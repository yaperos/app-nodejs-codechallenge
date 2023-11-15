// src/kafka/kafka.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import kafkaConfig from './kafka.config';
import { TransactionModule } from 'src/transactions/transaction.module';
import { AntiFraudModule } from 'src/antiFraud/antiFraud.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [kafkaConfig],
    }),
    TransactionModule,
    AntiFraudModule,
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class KafkaModule {}
