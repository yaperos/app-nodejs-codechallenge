import { Module } from '@nestjs/common';

import { KafkaModule } from '../kafka/kafka.module';
import { TransactionsService } from './services/transactions.service';
import { TransactionsController } from './controllers/transactions.controller';

@Module({
  imports: [KafkaModule],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
