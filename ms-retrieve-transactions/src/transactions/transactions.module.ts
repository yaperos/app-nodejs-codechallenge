import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/database/prisma.module';
import { CqrsModule } from '@nestjs/cqrs';
import { GetTransactionHandler } from './queries/handlers/get-transaction.handler';
import { TransactionCreatedHandler } from './events/handlers/transaction-created.handler';
import { EventsModule } from 'src/config/events/events.module';
import { TransactionsController } from 'src/api/transactions.controller';
import { TransactionRepository } from './repositories/transaction.repository';
import { TransactionApprovedHandler } from './events/handlers/transaction-approved.handler';
import { TransactionRejectedHandler } from './events/handlers/transaction-rejected.handler';

@Module({
  imports: [CqrsModule, PrismaModule, EventsModule],
  providers: [
    TransactionRepository,
    GetTransactionHandler,
    TransactionCreatedHandler,
    TransactionApprovedHandler,
    TransactionRejectedHandler,
  ],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
