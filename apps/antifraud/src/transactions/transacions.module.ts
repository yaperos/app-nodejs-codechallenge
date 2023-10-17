import { Module } from '@nestjs/common';
import { TransactionsSubscriber } from './infrastructure/transacions.subscriber';
import { TransactionsService } from './application/transactions.service';
import { EVENT_BUS, KafkaEventBus } from '@app/common';

@Module({
  providers: [
    TransactionsSubscriber,
    TransactionsService,
    {
      provide: EVENT_BUS,
      useClass: KafkaEventBus,
    },
  ],
})
export class TransactionsModule {}
