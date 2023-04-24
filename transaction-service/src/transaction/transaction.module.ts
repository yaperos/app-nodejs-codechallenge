import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { KafkaModule } from '../kafka/kafka.module';
import { TransactionApprovedConsumer } from './consumer/transaction.approved.consumer';
import { TransactionRejectedConsumer } from './consumer/transaction.rejected.consumer';
@Module({
  controllers: [TransactionController],
  providers: [TransactionService, TransactionRejectedConsumer],
  imports: [KafkaModule]
})
export class TransactionModule { }
