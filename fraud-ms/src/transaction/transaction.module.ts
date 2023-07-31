import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { KafkaModule } from '../shared/kafka/kafka.module';

@Module({
  imports: [KafkaModule],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
