// src/transaction/transaction.module.ts
import { Module } from '@nestjs/common';
import { TransactionController } from './controllers/transaction.controller';
import { TransactionService } from './services/transaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { KafkaModule } from './../kafka/kafka.module';
import { TransactionConsumerController } from './controllers/transaction-consumer.controller';
import { TransactionResolver } from './resolvers/transaction.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    KafkaModule
  ],
  controllers: [
    TransactionController,
    TransactionConsumerController
  ],
  providers: [
    TransactionService,
    TransactionResolver
  ],
  exports: [TransactionService],
})
export class TransactionModule { }