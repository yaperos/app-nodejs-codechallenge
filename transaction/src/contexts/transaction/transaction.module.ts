import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { KafkaModule } from '@/config/bus/kafka/kafka.module';
import { TransactionController } from './transaction.controller';
import { TransactionRepository } from '@/contexts/transaction/transaction.repository';

@Module({
  imports: [KafkaModule],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionRepository],
  exports: [TransactionService, TransactionRepository],
})
export class TransactionModule {}
