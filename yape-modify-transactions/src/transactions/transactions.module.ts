import { TransactionsController } from 'src/api/transactions.controller';
import { TransactionRepository } from './repositories/transaction.repository';
import { PrismaModule } from 'src/database/prisma.module';
import { EventsModule } from 'src/config/events/events.module';
import { Module } from '@nestjs/common';
import { CreateTransactionHandler } from './commands/handlers/create-transaction.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { TransactionApprovedHandler } from './events/handlers/transaction-approved.handler';
import { TransactionRejectedHandler } from './events/handlers/transaction-rejected.handler';

@Module({
    imports: [
        PrismaModule,
        EventsModule,
        CqrsModule
    ],
    providers: [
        TransactionRepository,
        CreateTransactionHandler,
        TransactionApprovedHandler,
        TransactionRejectedHandler
    ],
    controllers: [TransactionsController],
})
export class TransactionsModule { }