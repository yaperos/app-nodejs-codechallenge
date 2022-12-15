import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MessageConsumerController } from './adapter/input/messaging/message_consumer.controller';
import { TransactionEntity } from './domain/models/transaction.entity';
import { FraudAnalysisUsecase } from './domain/usecases/fraud_analysis.usecase';
import { TransactionService } from './adapter/output/db/transaction.service';
import { KafkaService } from './adapter/input/messaging/kafka.service';
import { MessageProducerController } from './adapter/input/messaging/message_producer.controller';
import configurationYaml from '../configuration.yaml';
@Module({
  imports: [
    ConfigModule.forRoot({ load: [configurationYaml], isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(<string>process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([TransactionEntity]),
  ],
  controllers: [MessageConsumerController, MessageProducerController],
  providers: [KafkaService, FraudAnalysisUsecase, TransactionService],
})
export class AppModule {}
