import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TransactionProducerService } from './Transaction/TransactionProducerService';
import { KafkaModule } from './kafka/kafka.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfig, DatabaseConfig } from './config';
import { TransactionProducer } from './Transaction/TransactionProducer';
import { TransactionModule } from './Transaction/Transaction.module';
import { AntiFraudModule } from './AntiFraud/AntiFraud.module';

@Module({
  imports: [
    KafkaModule,
    TransactionModule,
    AntiFraudModule,
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [AppConfig, DatabaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
      inject: [ConfigService],
    }),   
  ],
  controllers: [AppController],
  providers: [TransactionProducerService],
})
export class AppModule {}
