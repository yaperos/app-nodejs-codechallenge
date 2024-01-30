import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { KafkaModule } from '../core/kafka/kafka.module'; // Adjust the path as necessary

@Module({
  imports: [KafkaModule],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
