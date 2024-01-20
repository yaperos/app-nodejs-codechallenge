import { Module, forwardRef } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '../entities/transaction.entity';
import { KafkaModule } from 'src/kafka/kafka.module';
import { TransactionStatus } from 'src/entities/transactionStatus.entity';
import { TransferType } from 'src/entities/transferType.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, TransactionStatus, TransferType]),
    forwardRef(() => KafkaModule),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
