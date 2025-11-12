import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionResolver } from './transaction.resolver';
import { TransactionService } from './transaction.service';
import { Transaction } from '../../database/entities/transaction.entity';
import { TransactionType } from '../../database/entities/transaction-type.entity';
import { TransactionStatus } from '../../database/entities/transaction-status.entity';
import { KafkaModule } from '../../kafka/kafka.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, TransactionType, TransactionStatus]),
    KafkaModule,
  ],
  providers: [TransactionResolver, TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
