import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsumerProcessedEventEntity } from '../payments/entities/consumer-processed-event.entity';
import { LedgerEntryEntity } from '../payments/entities/ledger-entry.entity';
import { IdempotencyService } from './idempotency.service';
import { FraudConsumerService } from './fraud-consumer.service';
import { LedgerConsumerService } from './ledger-consumer.service';

@Module({
  imports: [TypeOrmModule.forFeature([ConsumerProcessedEventEntity, LedgerEntryEntity])],
  providers: [IdempotencyService, FraudConsumerService, LedgerConsumerService],
  exports: [IdempotencyService],
})
export class ConsumersModule {}
