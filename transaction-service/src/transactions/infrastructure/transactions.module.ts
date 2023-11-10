import { Module } from '@nestjs/common';

import { TransactionsResolver } from './transactions.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RetrieveTransaction, TransactionStatus, TransactionType } from '../domain/transaction.entity';
import { KafkaModule } from 'src/kafka/kafka.module';
import { TransactionsRepository } from './repository';
import { ProducerService } from 'src/kafka/producer.service';
import { TransactionsService } from './transactions.service';

@Module({
  imports: [TypeOrmModule.forFeature([
    RetrieveTransaction,
    TransactionStatus,
    TransactionType
  ]),
  KafkaModule
],
  providers: [
    {
      provide: 'ITransactionsRepository',
      useClass: TransactionsRepository, 
    },
    {
      provide: 'IProducerService',
      useClass: ProducerService
    },
    {
      provide: 'ITransactionsServiceUseCase',
      useClass: TransactionsService
    },
    TransactionsResolver
  ]
})
export class TransactionsModule {}
