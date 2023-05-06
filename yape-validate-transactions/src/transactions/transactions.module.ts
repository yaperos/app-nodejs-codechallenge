import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TransactionCreatedEvent } from './events/transaction-created.event';
import { TransactionCreatedHandler } from './events/handlers/transaction-created.handler';
import { EventsModule } from 'src/config/events/events.module';
import { TransactionsController } from 'src/expose/transactions.controller';

export const Events = { TransactionCreatedEvent };

@Module({
    imports: [
        CqrsModule,
        EventsModule
    ],
    providers: [
        TransactionCreatedHandler
    ],
    controllers: [
        TransactionsController
    ]
})
export class TransactionsModule { }