import { Module } from '@nestjs/common';
import { TransactionsSubscriber } from './infrastructure/antifraud-transacions.subscriber';
import { TransactionsService } from './application/antifraud-transactions.service';
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
