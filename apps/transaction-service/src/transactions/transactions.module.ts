import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { TransactionsConsumer } from './transactions.consumer';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService, TransactionsConsumer],
  exports: [TransactionsService],
})
export class TransactionsModule {}
