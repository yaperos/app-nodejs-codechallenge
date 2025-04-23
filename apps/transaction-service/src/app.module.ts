import { Module } from '@nestjs/common';
import { TransactionsModule } from './transactions/transactions.module';
import { KafkaEventsModule } from './kafka-events/kafka-events.module';

@Module({
  imports: [TransactionsModule, KafkaEventsModule],
})
export class AppModule {}
