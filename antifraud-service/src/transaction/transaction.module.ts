import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

import { KafkaService } from 'src/shared/kafka/kafka.service';

@Module({
  providers: [TransactionService, KafkaService],
  exports: [TransactionService],
  controllers: [TransactionController],
  imports: [],
})
export class TransactionModule {}
