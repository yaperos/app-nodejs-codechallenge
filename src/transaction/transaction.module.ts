import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TransactionController } from './presentation/transaction.controller.js';
import { CreateTransactionHandler } from './application/commands/create-transaction.handler.js';
import { GetTransactionByExternalIdHandler } from './application/queries/get-transaction-by-external-id.handler.js';
import { PrismaTransactionRepository } from './infrastructure/persistence/prisma-transaction.repository.js';
import { TRANSACTION_REPOSITORY } from './application/ports/transaction.repository.port.js';
import { KafkaProducerService } from './infrastructure/messaging/kafka-producer.service.js';
import { OutboxRelayService } from './infrastructure/messaging/outbox-relay.service.js';
import { TransactionStatusUpdatedConsumer } from './infrastructure/messaging/transaction-status-updated.consumer.js';

@Module({
  imports: [CqrsModule],
  controllers: [TransactionController],
  providers: [
    {
      provide: TRANSACTION_REPOSITORY,
      useClass: PrismaTransactionRepository,
    },
    CreateTransactionHandler,
    GetTransactionByExternalIdHandler,
    KafkaProducerService,
    OutboxRelayService,
    TransactionStatusUpdatedConsumer,
  ],
})
export class TransactionModule {}
