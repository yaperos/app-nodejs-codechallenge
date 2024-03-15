import { Module } from '@nestjs/common';
import { TransactionCatalogController } from './infrastructure/http/TransactionCatalog.controller';
import { TransactionCatalogService } from './application/services/impl/TransactionCatalogService';
import { TransactionCatalogRepository } from './infrastructure/database/repositories/TransactionCatalogRepository';
import { ITransactionCatalogRepository } from './domain/repositories/database/ITransactionCatalogRepository';
import { ITransactionCatalogService } from './application/services/ITransactionCatalogService';
import { ICacheRepository } from './domain/repositories/cache/ICacheRepository';
import { CacheRepository } from './infrastructure/cache/CacheRepository';
import { ITransactionRepository } from './domain/repositories/database/ITransactionRepository';
import { TransactionRepository } from './infrastructure/database/repositories/TransactionRepository';
import { RedisClientFactory } from './infrastructure/cache/CacheFactory';
import { TransactionController } from './infrastructure/http/Transaction.controller';
import { ITransactionService } from './application/services/ITransactionService';
import { TransactionService } from './application/services/impl/TransactionService';
import { KafkaProducerClientFactory } from './infrastructure/stream/KafkaProducerFactory';
import { IKafkaProducer } from './domain/stream/IKafkaProducer';
import { KafkaProducer } from './infrastructure/stream/KafkaProducer';

@Module({
  controllers: [TransactionCatalogController, TransactionController],
  providers: [
    RedisClientFactory,
    KafkaProducerClientFactory,
    {
      provide: ITransactionCatalogService,
      useClass: TransactionCatalogService,
    },
    {
      provide: ITransactionCatalogRepository,
      useClass: TransactionCatalogRepository,
    },
    {
      provide: ITransactionService,
      useClass: TransactionService,
    },
    {
      provide: ITransactionRepository,
      useClass: TransactionRepository,
    },
    {
      provide: ICacheRepository,
      useClass: CacheRepository,
    },
    {
      provide: IKafkaProducer,
      useClass: KafkaProducer,
    },
  ],
})
export class TransactionHistoryModule {}
