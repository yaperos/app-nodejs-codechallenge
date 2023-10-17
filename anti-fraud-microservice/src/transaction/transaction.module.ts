import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { KafkaModule } from 'src/kafka/kafka.module';
import  {PendingTransactionConsumer } from 'src/transaction/pendingTransaction.consumer'

@Module({
  imports:[KafkaModule],
  providers: [TransactionService, PendingTransactionConsumer],
  controllers: []
})
export class TransactionModule {}
