import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsResolver } from './transactions.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RetrieveTransaction
  , TransactionStatus, TransactionType } from './post.entity';
import { KafkaModule } from 'src/kafka/kafka.module';

@Module({
  imports: [TypeOrmModule.forFeature([
    RetrieveTransaction,
    TransactionStatus,
    TransactionType
  ]),
  KafkaModule
],
  providers: [
    TransactionsService, 
    TransactionsResolver
  ]
})
export class TransactionsModule {}
