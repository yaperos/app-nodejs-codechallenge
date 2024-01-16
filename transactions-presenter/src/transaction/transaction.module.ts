import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { KafkaService } from 'src/shared/kafka/kafka.service';

@Module({
  imports: [],
  controllers: [TransactionController],
  providers: [TransactionService, KafkaService],
})
export class TransactionModule {}
