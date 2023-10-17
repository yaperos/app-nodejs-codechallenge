import { Module } from '@nestjs/common';
import { EVENT_BUS, KafkaEventBus } from '@app/common';
import { ExternalTransactionsController } from './infrastructure/external-transactions.controller';
import { ExternalTransactionsSubscriber } from './infrastructure/external-transactions.subscriber';
import { ExternalTransactionsService } from './application/external-transactions.service';
import { MongodbExternalTransactionRepository } from './infrastructure/mongodb-external-transaction.repository';
import { EXTERNAL_TRANSACTION_REPOSITORY } from './domain/external-transaction.repository';

@Module({
  controllers: [ExternalTransactionsController],
  providers: [
    {
      provide: EXTERNAL_TRANSACTION_REPOSITORY,
      useClass: MongodbExternalTransactionRepository,
    },
    {
      provide: EVENT_BUS,
      useClass: KafkaEventBus,
    },
    ExternalTransactionsService,
    ExternalTransactionsSubscriber,
  ],
})
export class ExternalTransactionsModule {}
